"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.logout = exports.me = exports.changePassword = exports.deleteUser = exports.updateUser = exports.loginUser = exports.registerUser = exports.getUser = exports.userQuery = exports.User = void 0;
const argon2_1 = __importDefault(require("argon2"));
const graphql_fields_list_1 = require("graphql-fields-list");
const nexus_1 = require("nexus");
const sendEmail_1 = require("../../util/sendEmail");
const uuid_1 = require("uuid");
exports.User = (0, nexus_1.objectType)({
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
exports.userQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(type) {
        type.list.field("users", {
            type: "User",
            resolve(_root, _args, context, info) {
                let fields = (0, graphql_fields_list_1.fieldsMap)(info);
                Object.keys(fields).forEach((f) => {
                    fields[f] = true;
                });
                console.log(fields);
                return context.prisma.user.findMany({
                    select: Object.assign({}, fields),
                });
            },
        });
    },
});
exports.getUser = (0, nexus_1.extendType)({
    type: "Query",
    definition(type) {
        type.field("user", {
            type: "User",
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            validate: ({ string }) => ({
                email: string().required().email(),
            }),
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
exports.registerUser = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.field("registerUser", {
            type: "UserResponse",
            args: {
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                username: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                bio: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                avatar: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                coverImage: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
            },
            validate: ({ string }) => ({
                email: string().required().email(),
                username: string().required().min(3).max(25),
                password: string()
                    .required()
                    .min(8)
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
                    .typeError("Must Contain 8 Characters: One Uppercase, One Lowercase, One Number and one special case Character"),
                avatar: string().url(),
                coverImage: string().url(),
            }),
            resolve(_root, args, { prisma, req }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const exists = yield prisma.user.findUnique({ where: { email: args.email } });
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
                    const hashedPass = yield argon2_1.default.hash(args.password);
                    const user = yield prisma.user.create({
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
                });
            },
        });
    },
});
exports.loginUser = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.field("login", {
            type: "UserResponse",
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            validate: ({ string }) => ({
                email: string().required().email(),
                password: string().required(),
            }),
            resolve(_root, { email, password }, { prisma, req }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield prisma.user.findUnique({ where: { email } });
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
                    console.log(user.password);
                    const valid = yield argon2_1.default.verify(user.password, password);
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
                    console.log(req.session);
                    console.log(user.id);
                    return {
                        user,
                    };
                });
            },
        });
    },
});
exports.updateUser = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.field("updateUser", {
            type: "User",
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                name: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                bio: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                avatar: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                coverImage: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            validate: ({ string }) => ({
                email: string().required().email(),
                name: string().min(3).max(25),
                avatar: string().url(),
                coverImage: string().url(),
            }),
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
exports.deleteUser = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.field("deleteUser", {
            type: "UserResponse",
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            validate: ({ string }) => ({
                email: string().required().email(),
            }),
            resolve(_root, { email }, { prisma }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const exists = yield prisma.user.findUnique({ where: { email } });
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
                });
            },
        });
    },
});
exports.changePassword = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.field("updatePassword", {
            type: "UserResponse",
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                oldPassword: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
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
                    .typeError("Must Contain 8 Characters: One Uppercase, One Lowercase, One Number and one special case Character"),
            }),
            resolve(_root, { email, oldPassword, password }, { prisma }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const user = yield prisma.user.findUnique({ where: { email } });
                    if (!user) {
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
                        return {
                            errors: [
                                {
                                    field: "Password",
                                    message: "Old and New password can't be same",
                                },
                            ],
                        };
                    }
                    const validOldPassword = yield argon2_1.default.verify(user.password, oldPassword);
                    if (!validOldPassword) {
                        return {
                            errors: [
                                {
                                    field: "Old Password",
                                    message: `Entered old password is incorrect`,
                                },
                            ],
                        };
                    }
                    const hashedPass = yield argon2_1.default.hash(password);
                    const updatedUser = yield prisma.user.update({
                        where: { email },
                        data: { password: hashedPass },
                    });
                    return {
                        user: updatedUser,
                    };
                });
            },
        });
    },
});
exports.me = (0, nexus_1.extendType)({
    type: "Query",
    definition(type) {
        type.nullable.field("me", {
            type: "User",
            resolve(_root, _args, { prisma, req }) {
                if (!req.session.userId) {
                    return null;
                }
                return prisma.user.findUnique({
                    where: {
                        id: req.session.userId,
                    },
                });
            },
        });
    },
});
exports.logout = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.boolean("logout", {
            resolve(_root, _args, { req, res }, _info) {
                return new Promise((resolve) => {
                    req.session.destroy((err) => {
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
exports.forgotPassword = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.boolean("forgotPassword", {
            args: {
                email: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            validate: ({ string }) => ({
                email: string().email().required(),
            }),
            resolve(_root, { email }, { prisma, redis }) {
                return __awaiter(this, void 0, void 0, function* () {
                    let user = yield prisma.user.findUnique({ where: { email } });
                    if (!user) {
                        return true;
                    }
                    const token = (0, uuid_1.v4)();
                    yield redis.set("forget-password:" + token, user.id, "ex", 1000 * 60 * 60 * 24);
                    yield (0, sendEmail_1.sendEmail)(email, `<a href="http://localhost:3000/reset-password/${token}"> Reset Password</a>`);
                    return true;
                });
            },
        });
    },
});
exports.resetPassword = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.field("resetPassword", {
            type: "UserResponse",
            args: {
                token: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                password: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            validate: ({ string }) => ({
                token: string().required().uuid(),
                password: string()
                    .required()
                    .min(8)
                    .required()
                    .min(8)
                    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
                    .typeError("Must Contain 8 Characters: One Uppercase, One Lowercase, One Number and one special case Character"),
            }),
            resolve(_root, { token, password }, { prisma, redis, req }) {
                return __awaiter(this, void 0, void 0, function* () {
                    const userId = yield redis.getdel("forget-password:" + token);
                    console.log(userId);
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
                    const valid = yield prisma.user.findUnique({ where: { id: userId } });
                    if (!valid) {
                        return {
                            errors: [{ field: "Token", message: "User no longer exists" }],
                        };
                    }
                    const hashedPassword = yield argon2_1.default.hash(password);
                    const user = yield prisma.user.update({
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
                });
            },
        });
    },
});
//# sourceMappingURL=User.js.map