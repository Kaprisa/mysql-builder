// @flow

import DB from '../DB';
import QueryBuilder from '../builders/QueryBuilder';
import { DOWN } from '../constants/commands';
import { objectToQueryCondition } from '../utils/string';
import type { RowType, ConditionType } from '../constants/schema';

const idOrCondition = (id: ConditionType): RowType => (typeof id === 'object' ? id : { id });

export default class Table {
  name: string;

  query: QueryBuilder;

  constructor(name: string) {
    this.name = name;
    this.query = new QueryBuilder(name);
  }

  insert(params: RowType): Promise<void> {
    return DB.query(`INSERT INTO \`${this.name}\` SET ${objectToQueryCondition(params)}`);
  }

  replace(params: RowType): Promise<void> {
    return DB.query(`REPLACE INTO \`${this.name}\` SET ${objectToQueryCondition(params)}`);
  }

  update(id: ConditionType, params: RowType): Promise<void> {
    return DB.query(`UPDATE \`${this.name}\` SET ${objectToQueryCondition(params)} WHERE ${objectToQueryCondition(idOrCondition(id), ' AND ')}`);
  }

  delete(id: ?ConditionType): Promise<void> {
    return DB.query(`DELETE FROM \`${this.name}\` WHERE ${id ? objectToQueryCondition(idOrCondition(id), ' AND ') : 1}`);
  }

  set(id: ConditionType, field: string, value: any): Promise<void> {
    return this.update(id, { [field]: value });
  }

  get(condition: ?RowType): Promise<Array<RowType>> {
    return this.query.select().where(condition).get();
  }

  find(id: ConditionType): Promise<?RowType> {
    return this.query.select().where(idOrCondition(id)).one();
  }

  all(...fields: Array<string>): Promise<Array<RowType>> {
    return this.query.select(...fields).get();
  }

  first(params: ?RowType): Promise<{[string]: any}> {
    return this.query.select().where(params).sortBy('id').limit(1)
      .one();
  }

  last(params: ?RowType): Promise<{[string]: any}> {
    return this.query.select().where(params).sortBy('id', DOWN).limit(1)
      .one();
  }
}
