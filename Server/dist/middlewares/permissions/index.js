"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_shield_1 = require("graphql-shield");
const rules = {
    isAuth: (0, graphql_shield_1.rule)()((_root, _args, ctx) => {
        if (!ctx.req.session.userId)
            return new Error("User not authenticated");
        return true;
    }),
};
const permissions = (0, graphql_shield_1.shield)({
    Query: {
        posts: rules.isAuth,
    },
    Mutation: {
        createPost: rules.isAuth,
        deleteUser: rules.isAuth,
        logout: rules.isAuth,
        postComment: rules.isAuth,
        updatePassword: rules.isAuth,
        updateUser: rules.isAuth,
        voteComment: rules.isAuth,
        votePost: rules.isAuth,
    },
});
exports.default = permissions;
//# sourceMappingURL=index.js.map