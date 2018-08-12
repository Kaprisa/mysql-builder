// @flow

import DB from '../DB';
import QueryBuilder from '../builders/QueryBuilder';
import { DOWN } from '../constants/commands';

export type RowType = {[string]: any};
export type ConditionType = number | RowType;

const idOrCondition = (id: ConditionType): RowType => (typeof id === 'object' ? id : { id });

export default class Table {
  name: string;

  query: QueryBuilder;

  constructor(name: string) {
    this.name = name;
    this.query = new QueryBuilder(name);
  }

  insert(params: RowType): Promise<void> {
    return DB.query('INSERT INTO ? SET ?', [this.name, params]);
  }

  update(id: ConditionType, params: RowType): Promise<void> {
    return DB.query('UPDATE ? SET ? WHERE ?', [this.name, params, idOrCondition(id)]);
  }

  delete(id: ConditionType): Promise<void> {
    return DB.query('DELETE FROM ? WHERE ?', [this.name, idOrCondition(id)]);
  }

  set(id: ConditionType, field: string, value: any): Promise<void> {
    return this.update(id, { [field]: value });
  }

  find(id: ConditionType): Promise<?RowType> {
    return this.query.select().where(idOrCondition(id)).one();
  }

  all(): Promise<Array<RowType>> {
    return this.query.select().get();
  }

  first(): Promise<{[string]: any}> {
    return this.query.select().sortBy('id').limit(1).one();
  }

  last(): Promise<{[string]: any}> {
    return this.query.select().sortBy('id', DOWN).limit(1).one();
  }
}
