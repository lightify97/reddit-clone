import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import { createClient, dedupExchange, fetchExchange, ssrExchange } from 'urql';
import {
  MeDocument,
  LoginMutation,
  LogoutMutation,
  MeQuery,
  RegisterMutation,
  ResetPasswordMutation,
} from '../graphql/generated/graphql';
import typedUpdateQuery from './typedUpdateQuery';

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const results = [];
    fieldInfos.forEach((fi) => {
      const data = cache.resolve(entityKey, fi.fieldKey);
      Array.isArray(data) ? results.push(...data) : null;
    });
    return results;
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },

  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          feed: cursorPagination(),
        },
      },
      updates: {
        Mutation: {
          logout: (_result, args, cache, info) => {
            typedUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, args, cache, info) => {
            typedUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user,
                  };
                }
              }
            );
          },
          registerUser: (_result, args, cache, info) => {
            typedUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.registerUser.errors) {
                  return query;
                } else {
                  return {
                    me: result.registerUser.user,
                  };
                }
              }
            );
          },
          resetPassword: (_result, args, cache, info) => {
            typedUpdateQuery<ResetPasswordMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.resetPassword.errors) {
                  return query;
                } else {
                  return {
                    me: result.resetPassword.user,
                  };
                }
              }
            );
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
