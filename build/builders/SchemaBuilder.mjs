//

import DB from '../DB';
import FieldBuilder from './FieldBuilder';
import { ENGINES, CHARSETS, COLLATION } from '../constants/schema';


import { arrToQueryString } from '../utils/string';

export default class SchemaBuilder {
  constructor(table, engine = ENGINES.InnoDB, charset = CHARSETS.utf8, collate = COLLATION.utf8_general_ci) {
    this.table = table;
    this.engine = engine;
    this.charset = charset;
    this.collate = collate;
    this.fields = [];
  }

  add(name, f) {
    this.fields.push(f(new FieldBuilder(name)).get());
    this.last = 'FIELD';
    return this;
  }

  key(...fields) {
    this.fields.push(`KEY (${arrToQueryString(fields)}) `);
    this.last = 'KEY';
    return this;
  }

  unique() {
    if (!this.last === 'KEY') {
      throw new Error('UNIQUE can be only after KEY');
    }
    this.fields[this.fields.length - 1] = `UNIQUE ${this.fields[this.fields.length - 1]} `;
    return this;
  }

  primary() {
    if (!this.last === 'KEY') {
      throw new Error('PRIMARY can be only after KEY');
    }
    this.fields[this.fields.length - 1] = `PRIMARY ${this.fields[this.fields.length - 1]} `;
    return this;
  }

  foreign() {
    if (!this.last === 'KEY') {
      throw new Error('FOREIGN can be only after KEY');
    }
    this.fields[this.fields.length - 1] = `FOREIGN ${this.fields[this.fields.length - 1]} `;
    return this;
  }

  using(indexType) {
    if (!this.last === 'KEY') {
      throw new Error('Using can be only after KEY');
    }
    this.fields[this.fields.length - 1] += `USING ${indexType} `;
    return this;
  }

  build() {
    return `CREATE TABLE IF NOT EXISTS \`${this.table}\` (
      ${this.fields.join(', ')}
    ) ENGINE=${this.engine} DEFAULT CHARSET=${this.charset} COLLATE=${this.collate}`;
  }

  create() {
    return DB.query(this.build());
  }

  drop() {
    return DB.query(`DROP TABLE IF EXISTS \`${this.table}\``);
  }
}
