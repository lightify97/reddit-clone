import { MiddlewareFn } from "nexus/dist/plugin";

export const isAuth: MiddlewareFn = (source, args, ctx, info, next) => {
  if (!req.session.userId) throw new Error("Not Authenticated");
  next(source, args, ctx, info);
};
