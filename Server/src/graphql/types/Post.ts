import { extendType, nonNull, nullable, objectType, stringArg } from "nexus";

export const Post = objectType({
    name: "Post",
    definition(type) {
        type.nonNull.string('id');
        type.nonNull.string('createdAt');
        type.string('updatedAt');
        type.nonNull.string('title');
        type.nonNull.int('votes');
        type.string("content");
        type.field('author', {
            type: "User",
            resolve(root, _args, context, _info) {
                return context.prisma.post.findUnique({
                    where: {
                        id: root.id,
                    }
                }).author();
            }
        });
        type.list.field('comments', {
            type: "Comment",
            resolve(root, _args, { prisma }, _info) {
                return prisma.comment.findMany({
                    where: {
                        AND: [
                            { postId: { equals: root.id } },
                            { parentComment: { equals: null } }
                        ]
                    }
                });
            }

        })

    }
});


export const createPost = extendType({
    type: "Mutation",
    definition(type) {
        type.nonNull.field('createPost', {
            type: "Post",
            args: {
                title: nonNull(stringArg()),
                content: nullable(stringArg()),
                userId: nonNull(stringArg())
            },
            resolve(_root, args, { prisma }) {
                return prisma.post.create({
                    data: {
                        title: args.title,
                        content: args.content,
                        userId: args.userId
                    }
                })
            }
        })
    }
})

export const upvotePost = extendType({
    type: "Mutation",
    definition(type) {
        type.nonNull.field('votePost', {
            type: "Post",
            args: {
                postId: nonNull(stringArg()),
                vote: "voteOrder" //nonNull(intArg({ default: 1, }))
            },
            resolve(_, { postId, vote }, { prisma }) {
                return prisma.post.update({
                    where: { id: postId },
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




export const postsQuery = extendType({
    type: "Query",
    definition(type) {
        type.list.field("posts", {
            type: "Post",
            resolve(_root, _args, { prisma }, _info) {
                return prisma.post.findMany();
            }
        })
    }
})

export const postQuery = extendType({
    type: "Query",
    definition(type) {
        type.field("post", {
            type: "Post",
            args: {
                id: nonNull(stringArg()),
            },
            resolve(_root, { id }, { prisma },) {
                return prisma.post.findUnique({
                    where: {
                        id
                    }
                });
            }
        })
    }
})
