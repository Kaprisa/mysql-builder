//

import DB from '../DB';
import QueryBuilder from '../builders/QueryBuilder';
import { DOWN } from '../constants/commands';
import { objectToQueryCondition } from '../utils/string';


const idOrCondition = id => (typeof id === 'object' ? id : { id });

export default class Table {
  constructor(name) {
    this.name = name;
    this.query = new QueryBuilder(name);
  }

  insert(params) {
    return DB.query(`INSERT INTO \`${this.name}\` SET ${objectToQueryCondition(params)}`);
  }

  replace(params) {
    return DB.query(`REPLACE INTO \`${this.name}\` SET ${objectToQueryCondition(params)}`);
  }

  update(id, params) {
    return DB.query(`UPDATE \`${this.name}\` SET ${objectToQueryCondition(params)} WHERE ${objectToQueryCondition(idOrCondition(id), ' AND ')}`);
  }

  delete(id) {
    return DB.query(`DELETE FROM \`${this.name}\` WHERE ${id ? objectToQueryCondition(idOrCondition(id), ' AND ') : 1}`);
  }

  set(id, field, value) {
    return this.update(id, { [field]: value });
  }

  get(condition) {
    return this.query.select().where(condition).get();
  }

  find(id) {
    return this.query.select().where(idOrCondition(id)).one();
  }

  all(...fields) {
    return this.query.select(...fields).get();
  }

  first(params) {
    return this.query.select().where(params).sortBy('id').limit(1)
      .one();
  }

  last(params) {
    return this.query.select().where(params).sortBy('id', DOWN).limit(1)
      .one();
  }
}
