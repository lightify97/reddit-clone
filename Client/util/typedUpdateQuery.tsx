import { Cache, QueryInput } from '@urql/exchange-graphcache';

// setup urql client
function typedUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

export default typedUpdateQuery;