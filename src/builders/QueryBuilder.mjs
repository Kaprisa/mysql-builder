// @flow

import DB from '../DB';
import {
  WHERE, SELECT, HAVING, GROUP, SKIP, LIMIT, SORT, UP, WHERE_SIGN,
} from '../constants/commands';
import type {
  SortDirection, SQLCommand, AggregationType, WhereSign,
} from '../constants/commands';
import { arrToQueryString, objectToQueryCondition } from '../utils/string';
import type { RowType } from '../constants/schema';

export default class QueryBuilder {
  query: string;

  lastCommand: SQLCommand;

  table: string;

  constructor(table: string) {
    this.table = table;
  }

  validate(command: SQLCommand, commands: Array<SQLCommand>): void {
    if (!commands.includes(this.lastCommand)) {
      throw new Error(`Unable to insert ${command} after ${this.lastCommand}`);
    }
    this.lastCommand = command;
  }

  select(...fields: Array<string>): QueryBuilder {
    this.query = `${SELECT} ${arrToQueryString(fields)} FROM \`${this.table}\` `;
    this.lastCommand = SELECT;
    return this;
  }

  aggregate(f: AggregationType, field: string, as: string = ''): QueryBuilder {
    if (!this.lastCommand === SELECT) {
      throw new Error('Aggregation must be after SELECT command.');
    }
    this.query = this.query.replace(' FROM', `, ${f}(\`${field}\`) ${as} FROM`);
    return this;
  }

  where(field: string | ?RowType, sign: WhereSign = WHERE_SIGN.EQUAL, cond: Array<string> | string | number = '', startWith: string = WHERE): QueryBuilder {
    this.validate(WHERE, [SELECT, WHERE]);
    if (typeof field === 'string') {
      this.query += `${startWith} \`${field}\` ${sign} ${Array.isArray(cond) ? `(${arrToQueryString(cond)})` : typeof cond === 'string' ? `'${cond}'` : cond} `;
    } else {
      this.query += field ? `${WHERE} ${objectToQueryCondition(field, ' AND ')} ` : '';
    }
    return this;
  }

  sortBy(field: string, direction: SortDirection = UP): QueryBuilder {
    this.validate(SORT, [SELECT, WHERE, GROUP, HAVING]);
    this.query += `${SORT} \`${field}\` ${direction} `;
    return this;
  }

  groupBy(...fields: Array<string>): QueryBuilder {
    this.validate(GROUP, [SELECT, WHERE, LIMIT]);
    this.query += `${GROUP} ${arrToQueryString(fields)} `;
    return this;
  }

  limit(count: number): QueryBuilder {
    this.validate(LIMIT, [SELECT, WHERE, SKIP, SORT]);
    this.query += `${LIMIT} ${count} `;
    return this;
  }

  having(...params: Array<string | number>): QueryBuilder {
    this.validate(HAVING, [GROUP]);
    this.query += `${HAVING} ${params.join(' AND ')} `;
    return this;
  }

  offset(count: number): QueryBuilder {
    this.validate(SKIP, [SELECT, WHERE, LIMIT]);
    this.query = `${this.query} ${SKIP} ${count} `;
    return this;
  }

  build(): string {
    return this.query;
  }

  get(): Promise<Array<{[string]: any}>> {
    return DB.query(this.query);
  }

  one(): Promise<{[string]: any}> {
    return DB.queryRow(this.query);
  }
}
