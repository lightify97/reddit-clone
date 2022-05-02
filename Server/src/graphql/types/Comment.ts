//FIXME: Remove all the type errors
import { extendType, intArg, nonNull, nullable, objectType, stringArg } from "nexus";

export const Comment = objectType({
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


export const postComment = extendType({
    type: "Mutation",
    definition(type) {
        type.field('postComment', {
            type: "Comment",
            args: {
                postId: nonNull(stringArg()),
                content: nonNull(stringArg()),
                parentComment: nullable(intArg()),
                userId: nonNull(stringArg()),
            },
            resolve(_root, args, { prisma }) {
                return prisma.comment.create({
                    data: {
                        content: args.content,
                        postId: args.postId,
                        parentComment: args.parentComment,
                        userId: args.userId
                    }
                })
            }
        })
    }
})

export const upvoteComment = extendType({
    type: "Mutation",
    definition(type) {
        type.nonNull.field('voteComment', {
            type: "Comment",
            args: {
                id: nonNull(intArg()),
                vote: "voteOrder"
            },
            resolve(_, { id, vote }, { prisma }) {
                return prisma.comment.update({
                    where: { id },
                    data: {
                        votes: {
                            increment: vote as number
                        }
                    }
                })
            }
        })
    }
})

export const getCommentReplies = extendType({
    type: "Query",
    definition(type) {
        type.list.field('replies', {
            type: "Comment",
            args: {
                commentId: nonNull(intArg())
            },
            resolve(_root, args, { prisma }) {
                return prisma.comment.findMany({
                    where: {
                        parentComment: args.commentId
                    }
                })
            }
        });
    }
})

export const getPostComments = extendType({
    type: "Query",
    definition(type) {
        type.list.field('postComments', {
            type: "Comment",
            args: {
                id: nonNull(stringArg()),
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
        })
    }
})