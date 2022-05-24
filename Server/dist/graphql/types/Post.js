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
        type.nonNull.string("content");
        type.nonNull.field("author", {
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
            authorize: (_root, args, ctx) => !!ctx.req.session.userId,
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
            authorize: (_root, args, ctx) => !!ctx.req.session.userId,
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
        type.list.field("feed", {
            type: "Post",
            args: {
                take: (0, nexus_1.nonNull)((0, nexus_1.intArg)({ default: 15 })),
                cursor: (0, nexus_1.nullable)((0, nexus_1.stringArg)()),
            },
            authorize: (_root, args, ctx) => !!ctx.req.session.userId,
            resolve(_root, { take, cursor }, { prisma }, _info) {
                return __awaiter(this, void 0, void 0, function* () {
                    take = Math.min(take, 15);
                    if (cursor) {
                        return prisma.post.findMany({
                            take,
                            where: {
                                createdAt: {
                                    lt: new Date(parseInt(cursor)),
                                },
                            },
                            orderBy: {
                                createdAt: "desc",
                            },
                        });
                    }
                    else {
                        return prisma.post.findMany({
                            take,
                            orderBy: {
                                createdAt: "desc",
                            },
                        });
                    }
                });
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