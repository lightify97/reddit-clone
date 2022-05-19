import { allow, not, rule, shield } from "graphql-shield";
import { Context } from "../../context";

const rules = {
  isAuth: rule()((_root, _args, ctx: Context) => {
    if (!ctx.req.session.userId) return new Error("User not authenticated");
    return true;
  }),
};

const permissions = shield({
  Query: {
    posts: rules.isAuth,
    me: allow,
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

export default permissions;
