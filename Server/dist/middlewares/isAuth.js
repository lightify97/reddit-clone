"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = (source, args, ctx, info, next) => {
    if (!req.session.userId)
        throw new Error("Not Authenticated");
    next(source, args, ctx, info);
};
exports.isAuth = isAuth;
//# sourceMappingURL=isAuth.js.map