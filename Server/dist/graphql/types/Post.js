"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQuery = exports.postsQuery = exports.upvotePost = exports.createPost = exports.Post = void 0;
const nexus_1 = require("nexus");
exports.Post = (0, nexus_1.objectType)({
    name: "Post",
    definition(type) {
        type.nonNull.string("id");
        type.nonNull.string("createdAt");
        type.string("updatedAt");
        type.nonNull.string("title");
        type.nonNull.int("votes");
        type.string("content");
        type.field("author", {
            type: "User",
            resolve(root, _args, context, _info) {
                return context.prisma.post
                    .findUnique({
                    where: {
                        id: root.id,
                    },
                })
                    .author();
            },
        });
        type.list.field("comments", {
            type: "Comment",
            resolve(root, _args, { prisma }, _info) {
                return prisma.comment.findMany({
                    where: {
                        AND: [{ postId: { equals: root.id } }, { parentComment: { equals: null } }],
                    },
                });
            },
        });
    },
});
exports.createPost = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.field("createPost", {
            type: "Post",
            args: {
                title: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                content: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
                userId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_root, args, { prisma }) {
                return prisma.post.create({
                    data: {
                        title: args.title,
                        content: args.content,
                        userId: args.userId,
                    },
                });
            },
        });
    },
});
exports.upvotePost = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.field("votePost", {
            type: "Post",
            args: {
                postId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                vote: "voteOrder",
            },
            resolve(_, { postId, vote }, { prisma }) {
                return prisma.post.update({
                    where: { id: postId },
                    data: {
                        votes: {
                            increment: vote,
                        },
                    },
                });
            },
        });
    },
});
exports.postsQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(type) {
        type.list.field("posts", {
            type: "Post",
            args: {
                byUser: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
            },
            resolve(_root, { byUser }, { prisma }, _info) {
                if (byUser !== null) {
                    return prisma.user.findUnique({ where: { id: byUser } }).posts();
                }
                return prisma.post.findMany();
            },
        });
    },
});
exports.postQuery = (0, nexus_1.extendType)({
    type: "Query",
    definition(type) {
        type.field("post", {
            type: "Post",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_root, { id }, { prisma }) {
                return prisma.post.findUnique({
                    where: {
                        id,
                    },
                });
            },
        });
    },
});
//# sourceMappingURL=Post.js.map