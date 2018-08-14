// @flow

import DB from '../DB';
import FieldBuilder from './FieldBuilder';
import { ENGINES, CHARSETS, COLLATION } from '../constants/schema';
import type {
  Engine, Charset, Collation, IndexType,
} from '../constants/schema';
import { arrToQueryString } from '../utils/string';

export default class SchemaBuilder {
  table: string;

  fields: Array<string>;

  engine: Engine;

  charset: Charset;

  collate: Collation;

  last: string;

  constructor(table: string, engine: Engine = ENGINES.InnoDB, charset: Charset = CHARSETS.utf8, collate: Collation = COLLATION.utf8_general_ci) {
    this.table = table;
    this.engine = engine;
    this.charset = charset;
    this.collate = collate;
    this.fields = [];
  }

  add(name: string, f: (b: FieldBuilder) => FieldBuilder): SchemaBuilder {
    this.fields.push(f(new FieldBuilder(name)).get());
    this.last = 'FIELD';
    return this;
  }

  key(...fields: Array<string>): SchemaBuilder {
    this.fields.push(`KEY (${arrToQueryString(fields)}) `);
    this.last = 'KEY';
    return this;
  }

  unique(): SchemaBuilder {
    if (!this.last === 'KEY') {
      throw new Error('UNIQUE can be only after KEY');
    }
    this.fields[this.fields.length - 1] = `UNIQUE ${this.fields[this.fields.length - 1]} `;
    return this;
  }

  primary(): SchemaBuilder {
    if (!this.last === 'KEY') {
      throw new Error('PRIMARY can be only after KEY');
    }
    this.fields[this.fields.length - 1] = `PRIMARY ${this.fields[this.fields.length - 1]} `;
    return this;
  }

  foreign(): SchemaBuilder {
    if (!this.last === 'KEY') {
      throw new Error('FOREIGN can be only after KEY');
    }
    this.fields[this.fields.length - 1] = `FOREIGN ${this.fields[this.fields.length - 1]} `;
    return this;
  }

  using(indexType: IndexType): SchemaBuilder {
    if (!this.last === 'KEY') {
      throw new Error('Using can be only after KEY');
    }
    this.fields[this.fields.length - 1] += `USING ${indexType} `;
    return this;
  }

  build(): string {
    return `CREATE TABLE IF NOT EXISTS \`${this.table}\` (
      ${this.fields.join(', ')}
    ) ENGINE=${this.engine} DEFAULT CHARSET=${this.charset} COLLATE=${this.collate}`;
  }

  create(): Promise<void> {
    return DB.query(this.build());
  }

  drop(): Promise<void> {
    return DB.query(`DROP TABLE IF EXISTS \`${this.table}\``);
  }
}
