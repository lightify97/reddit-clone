"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostComments = exports.getCommentReplies = exports.upvoteComment = exports.postComment = exports.Comment = void 0;
const nexus_1 = require("nexus");
exports.Comment = (0, nexus_1.objectType)({
    name: "Comment",
    definition(type) {
        type.nonNull.int('id');
        type.nonNull.string("createdAt");
        type.string('updatedAt');
        type.nonNull.string("content");
        type.nonNull.int('votes');
        type.nonNull.string('postId');
        type.nonNull.field('post', {
            type: "Post",
            resolve(root, _, context) {
                return context.prisma.comment.findUnique({
                    where: {
                        id: root.id
                    }
                }).post();
            }
        });
        type.nonNull.field('author', {
            type: "User",
            resolve(root, _, context) {
                return context.prisma.comment.findUnique({ where: { id: root.id } }).author();
            }
        });
        type.id('parentComment');
    }
});
exports.postComment = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.field('postComment', {
            type: "Comment",
            args: {
                postId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                content: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
                parentComment: (0, nexus_1.nullable)((0, nexus_1.intArg)()),
                userId: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_root, args, { prisma }) {
                return prisma.comment.create({
                    data: {
                        content: args.content,
                        postId: args.postId,
                        parentComment: args.parentComment,
                        userId: args.userId
                    }
                });
            }
        });
    }
});
exports.upvoteComment = (0, nexus_1.extendType)({
    type: "Mutation",
    definition(type) {
        type.nonNull.field('voteComment', {
            type: "Comment",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.intArg)()),
                vote: "voteOrder"
            },
            resolve(_, { id, vote }, { prisma }) {
                return prisma.comment.update({
                    where: { id },
                    data: {
                        votes: {
                            increment: vote
                        }
                    }
                });
            }
        });
    }
});
exports.getCommentReplies = (0, nexus_1.extendType)({
    type: "Query",
    definition(type) {
        type.list.field('replies', {
            type: "Comment",
            args: {
                commentId: (0, nexus_1.nonNull)((0, nexus_1.intArg)())
            },
            resolve(_root, args, { prisma }) {
                return prisma.comment.findMany({
                    where: {
                        parentComment: args.commentId
                    }
                });
            }
        });
    }
});
exports.getPostComments = (0, nexus_1.extendType)({
    type: "Query",
    definition(type) {
        type.list.field('postComments', {
            type: "Comment",
            args: {
                id: (0, nexus_1.nonNull)((0, nexus_1.stringArg)()),
            },
            resolve(_root, { id }, { prisma }) {
                return prisma.comment.findMany({
                    where: {
                        AND: [
                            { postId: { equals: id } },
                            { parentComment: { equals: null } }
                        ]
                    }
                });
            }
        });
    }
});
//# sourceMappingURL=Comment.js.map