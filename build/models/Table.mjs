//

import DB from '../DB';
import QueryBuilder from '../builders/QueryBuilder';
import { DOWN } from '../constants/commands';


const idOrCondition = id => (typeof id === 'object' ? id : { id });

export default class Table {
  constructor(name) {
    this.name = name;
    this.query = new QueryBuilder(name);
  }

  insert(params) {
    return DB.query('INSERT INTO ? SET ?', [this.name, params]);
  }

  update(id, params) {
    return DB.query('UPDATE ? SET ? WHERE ?', [this.name, params, idOrCondition(id)]);
  }

  delete(id) {
    return DB.query('DELETE FROM ? WHERE ?', [this.name, idOrCondition(id)]);
  }

  set(id, field, value) {
    return this.update(id, { [field]: value });
  }

  find(id) {
    return this.query.select().where(idOrCondition(id)).one();
  }

  all() {
    return this.query.select().get();
  }

  first() {
    return this.query.select().sortBy('id').limit(1).one();
  }

  last() {
    return this.query.select().sortBy('id', DOWN).limit(1).one();
  }
}
