// @flow

export const SELECT = 'SELECT';
export const WHERE = 'WHERE';
export const SORT = 'ORDER BY';
export const SKIP = 'OFFSET';
export const GROUP = 'GROUP BY';
export const HAVING = 'HAVING';
export const LIMIT = 'LIMIT';

export type SQLCommand = typeof SELECT | typeof WHERE | typeof SORT | typeof SKIP | typeof GROUP | typeof HAVING | typeof LIMIT;

export const UP = 'ASC';
export const DOWN = 'DESC';

export type SortDirection = typeof UP | typeof DOWN;

export const AGGREGATION = {
  SUM: 'SUM',
  AVG: 'AVG',
  COUNT: 'COUNT',
  MIN: 'MIN',
  MAX: 'MAX',
};

export type AggregationType = $Values<typeof AGGREGATION>;

export const WHERE_SIGN = {
  IN: 'IN',
  NOT_IN: 'NOT IN',
  LIKE: 'LIKE',
  GT: '>',
  LT: '<',
  EQUAL: '=',
};

export type WhereSign = $Values<typeof WHERE_SIGN>;
