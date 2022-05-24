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
const graphql_shield_1 = require("graphql-shield");
const rules = {
    isAuth: (0, graphql_shield_1.rule)({ cache: "contextual" })((_root, _args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
        if (ctx.req.session.userId === null)
            return false;
        return true;
    })),
};
const permissions = (0, graphql_shield_1.shield)({
    Query: {
        feed: rules.isAuth,
        me: graphql_shield_1.allow,
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
}, {
    debug: true
});
;
exports.default = permissions;
//# sourceMappingURL=index.js.map