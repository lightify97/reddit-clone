import argon2 from "argon2";
import { fieldsMap } from "graphql-fields-list";
import { extendType, nonNull, nullable, objectType, stringArg } from "nexus";
import { sendEmail } from "../../util/sendEmail";
import { v4 } from "uuid";

export const User = objectType({
  name: "User",
  definition(type) {
    type.nonNull.string("id");
    type.nonNull.string("createdAt");
    type.string("updatedAt");
    type.nonNull.string("email");
    type.nonNull.string("name");
    type.string("avatar");
    type.string("coverImage");
    type.string("bio");
    type.list.field("posts", {
      type: "Post",
      resolve(root, _args, context, _info) {
        return context.prisma.user
          .findUnique({
            where: { id: root.id },
          })
          .posts();
      },
    });
    type.list.field("comments", {
      type: "Comment",
      resolve(root, _args, context, _info) {
        return context.prisma.user.findUnique({ where: { id: root.id } }).comments();
      },
    });
  },
});

export const userQuery = extendType({
  type: "Query",
  definition(type) {
    type.list.field("users", {
      type: "User",
      resolve(_root, _args, context, info) {
        let fields = fieldsMap(info);
        Object.keys(fields).forEach((f) => {
          fields[f] = true;
        });
        return context.prisma.user.findMany({
          select: {
            ...fields,
          },
        });
      },
    });
  },
});

export const getUser = extendType({
  type: "Query",
  definition(type) {
    type.field("user", {
      type: "User",
      args: {
        email: nonNull(stringArg()),
      },
      validate: ({ string }) => ({
        email: string().required().email(),
      }),
      authorize: (_root, args, ctx) => !!ctx.req.session.userId,
      resolve(_root, { email }, { prisma }, _info) {
        return prisma.user.findUnique({
          where: {
            email,
          },
        });
      },
    });
  },
});

export const registerUser = extendType({
  type: "Mutation",
  definition(type) {
    type.nonNull.field("registerUser", {
      type: "UserResponse",
      args: {
        password: nonNull(stringArg()),
        email: nonNull(stringArg()),
        username: nonNull(stringArg()),
        bio: nullable(stringArg()),
        avatar: nullable(stringArg()),
        coverImage: nullable(stringArg()),
      },
      validate: ({ string }) => ({
        // validate that email is an actual email
        email: string().required().email(),
        username: string().required().min(3).max(25),
        password: string()
          .required()
          .min(8)
          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
          .typeError(
            "Must Contain 8 Characters: One Uppercase, One Lowercase, One Number and one special case Character"
          ),
        avatar: string().url(),
        coverImage: string().url(),
      }),
      async resolve(_root, args, { prisma, req }) {
        const exists = await prisma.user.findUnique({ where: { email: args.email } });
        if (exists) {
          return {
            errors: [
              {
                field: "Email",
                message: "Email is already registered",
              },
            ],
          };
        }
        const hashedPass = await argon2.hash(args.password);
        const user = await prisma.user.create({
          data: {
            email: args.email,
            name: args.username,
            password: hashedPass,
            bio: args.bio || undefined,
            avatar: args.avatar || undefined,
            coverImage: args.coverImage || undefined,
          },
        });
        req.session.userId = user.id;
        return {
          user,
        };
      },
    });
  },
});

export const loginUser = extendType({
  type: "Mutation",
  definition(type) {
    type.field("login", {
      type: "UserResponse",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      validate: ({ string }) => ({
        email: string().required().email(),
        password: string().required(),
      }),
      async resolve(_root, { email, password }, { prisma, req }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return {
            errors: [
              {
                field: "Email",
                message: `User with email: ${email} not found`,
              },
            ],
          };
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
          return {
            errors: [
              {
                field: "Password",
                message: "Password is incorrect",
              },
            ],
          };
        }

        req.session.userId = user.id;
        return {
          user,
        };
      },
    });
  },
});

export const updateUser = extendType({
  type: "Mutation",
  definition(type) {
    type.nonNull.field("updateUser", {
      type: "User",
      args: {
        email: nonNull(stringArg()),
        name: nullable(stringArg()),
        bio: nullable(stringArg()),
        avatar: nonNull(stringArg()),
        coverImage: nonNull(stringArg()),
      },
      validate: ({ string }) => ({
        email: string().required().email(),
        name: string().min(3).max(25),
        avatar: string().url(),
        coverImage: string().url(),
      }),
      authorize: (_root, args, ctx) => !!ctx.req.session.userId,
      resolve(_root, args, context) {
        return context.prisma.user.update({
          where: {
            email: args.email,
          },
          data: {
            name: args.name || undefined,
            bio: args.bio || undefined,
            avatar: args.avatar || undefined,
            coverImage: args.coverImage || undefined,
          },
        });
      },
    });
  },
});

export const deleteUser = extendType({
  type: "Mutation",
  definition(type) {
    type.field("deleteUser", {
      type: "UserResponse",
      args: {
        email: nonNull(stringArg()),
      },
      validate: ({ string }) => ({
        email: string().required().email(),
      }),
      authorize: (_root, args, ctx) => !!ctx.req.session.userId,
      async resolve(_root, { email }, { prisma }) {
        const exists = await prisma.user.findUnique({ where: { email } });
        if (!exists) {
          return {
            errors: [
              {
                field: "Email",
                message: `User with email ${email} doesn't exist.`,
              },
            ],
          };
        }
        const user = prisma.user.delete({ where: { email } });
        return {
          user,
        };
      },
    });
  },
});

export const changePassword = extendType({
  type: "Mutation",
  definition(type) {
    type.nonNull.field("updatePassword", {
      type: "UserResponse",
      args: {
        email: nonNull(stringArg()),
        oldPassword: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      validate: ({ string }) => ({
        email: string().required().email(),
        oldPassword: string().required().min(8),
        password: string()
          .required()
          .min(8)
          .required()
          .min(8)
          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
          .typeError(
            "Must Contain 8 Characters: One Uppercase, One Lowercase, One Number and one special case Character"
          ),
      }),
      async resolve(_root, { email, oldPassword, password }, { prisma }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          // if user with email not found throw error
          return {
            errors: [
              {
                field: "Email",
                message: `User with email: ${email} doesn't exist!!`,
              },
            ],
          };
        }
        if (oldPassword === password) {
          // if old password equals new password throw error
          return {
            errors: [
              {
                field: "Password",
                message: "Old and New password can't be same",
              },
            ],
          };
        }
        const validOldPassword = await argon2.verify(user.password, oldPassword);
        if (!validOldPassword) {
          // only proceed if user entered actual old password
          return {
            errors: [
              {
                field: "Old Password",
                message: `Entered old password is incorrect`,
              },
            ],
          };
        }
        const hashedPass = await argon2.hash(password);
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { password: hashedPass },
        });
        return {
          user: updatedUser,
        };
      },
    });
  },
});

export const me = extendType({
  type: "Query",
  definition(type) {
    type.nullable.field("me", {
      type: "User",
      resolve(_root, _args, { prisma, req }) {
        if (req.session.userId) {
          return prisma.user.findUnique({
            where: {
              id: req.session.userId,
            },
          });
        }
        return null;
      },
    });
  },
});

export const logout = extendType({
  type: "Mutation",
  definition(type) {
    type.nonNull.boolean("logout", {
      authorize: (_root, args, ctx) => !!ctx.req.session.userId,
      resolve(_root, _args, { req, res }, _info) {
        return new Promise((resolve) => {
          req.session.destroy((err: any) => {
            // req.session.userId = null;
            res.clearCookie("qid");
            if (err) {
              resolve(false);
              return;
            }
            resolve(true);
          });
        });
      },
    });
  },
});

export const forgotPassword = extendType({
  type: "Mutation",
  definition(type) {
    type.nonNull.boolean("forgotPassword", {
      args: {
        email: nonNull(stringArg()),
      },
      validate: ({ string }) => ({
        email: string().email().required(),
      }),
      async resolve(_root, { email }, { prisma, redis }) {
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          return true;
        }
        const token = v4();
        await redis.set("forget-password:" + token, user.id, "ex", 1000 * 60 * 60 * 24); // only keep the key for one day
        await sendEmail(email, `<a href="http://localhost:3000/reset-password/${token}"> Reset Password</a>`);
        return true;
      },
    });
  },
});

export const resetPassword = extendType({
  type: "Mutation",
  definition(type) {
    type.nonNull.field("resetPassword", {
      type: "UserResponse",
      args: {
        token: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      validate: ({ string }) => ({
        token: string().required().uuid(),
        password: string()
          .required()
          .min(8)
          .required()
          .min(8)
          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
          .typeError(
            "Must Contain 8 Characters: One Uppercase, One Lowercase, One Number and one special case Character"
          ),
      }),
      async resolve(_root, { token, password }, { prisma, redis, req }) {
        const userId = await redis.getdel("forget-password:" + token);
        if (!userId) {
          return {
            errors: [
              {
                field: "Token",
                message: "Invalid Token",
              },
            ],
          };
        }

        const valid = await prisma.user.findUnique({ where: { id: userId } });
        if (!valid) {
          return {
            errors: [{ field: "Token", message: "User no longer exists" }],
          };
        }
        const hashedPassword = await argon2.hash(password);
        const user = await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            password: hashedPassword,
          },
        });

        req.session.userId = user.id;
        return {
          user,
        };
      },
    });
  },
});
