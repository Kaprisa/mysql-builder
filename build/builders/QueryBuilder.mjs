//

import DB from '../DB';
import {
  WHERE, SELECT, HAVING, GROUP, SKIP, LIMIT, SORT, UP, WHERE_SIGN,
} from '../constants/commands';


import { arrToQueryString, objectToQueryCondition } from '../utils/string';


export default class QueryBuilder {
  constructor(table) {
    this.table = table;
  }

  validate(command, commands) {
    if (!commands.includes(this.lastCommand)) {
      throw new Error(`Unable to insert ${command} after ${this.lastCommand}`);
    }
    this.lastCommand = command;
  }

  select(...fields) {
    this.query = `${SELECT} ${arrToQueryString(fields)} FROM \`${this.table}\` `;
    this.lastCommand = SELECT;
    return this;
  }

  aggregate(f, field, as = '') {
    if (!this.lastCommand === SELECT) {
      throw new Error('Aggregation must be after SELECT command.');
    }
    this.query = this.query.replace(' FROM', `, ${f}(\`${field}\`) ${as} FROM`);
    return this;
  }

  where(field, sign = WHERE_SIGN.EQUAL, cond = '', startWith = WHERE) {
    this.validate(WHERE, [SELECT, WHERE]);
    if (typeof field === 'string') {
      this.query += `${startWith} \`${field}\` ${sign} ${Array.isArray(cond) ? `(${arrToQueryString(cond)})` : typeof cond === 'string' ? `'${cond}'` : cond} `;
    } else {
      this.query += field ? `${WHERE} ${objectToQueryCondition(field, ' AND ')} ` : '';
    }
    return this;
  }

  sortBy(field, direction = UP) {
    this.validate(SORT, [SELECT, WHERE, GROUP, HAVING]);
    this.query += `${SORT} \`${field}\` ${direction} `;
    return this;
  }

  groupBy(...fields) {
    this.validate(GROUP, [SELECT, WHERE, LIMIT]);
    this.query += `${GROUP} ${arrToQueryString(fields)} `;
    return this;
  }

  limit(count) {
    this.validate(LIMIT, [SELECT, WHERE, SKIP, SORT]);
    this.query += `${LIMIT} ${count} `;
    return this;
  }

  having(...params) {
    this.validate(HAVING, [GROUP]);
    this.query += `${HAVING} ${params.join(' AND ')} `;
    return this;
  }

  offset(count) {
    this.validate(SKIP, [SELECT, WHERE, LIMIT]);
    this.query = `${this.query} ${SKIP} ${count} `;
    return this;
  }

  build() {
    return this.query;
  }

  get() {
    return DB.query(this.query);
  }

  one() {
    return DB.queryRow(this.query);
  }
}
