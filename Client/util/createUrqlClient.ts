import { cacheExchange } from '@urql/exchange-graphcache';
import { createClient, dedupExchange, fetchExchange, ssrExchange } from 'urql';
import {
  MeDocument,
  LoginMutation,
  LogoutMutation,
  MeQuery,
  RegisterMutation,
} from '../graphql/generated/graphql';
import typedUpdateQuery from './typedUpdateQuery';

export const createUrqlClient = (ssrExchange: any, ctx: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const,
  },

  exchanges: [
    dedupExchange,
    cacheExchange({
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
                if (result.login?.errors) {
                  return query;
                } else {
                  return {
                    me: result.login?.user,
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
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});
