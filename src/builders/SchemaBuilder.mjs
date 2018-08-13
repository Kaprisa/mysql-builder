// @flow

import DB from '../DB';
import FieldBuilder from './FieldBuilder';
import { ENGINES, CHARSETS, COLLATION } from '../constants/schema';
import type { Engine, Charset, Collation } from '../constants/schema';

export default class SchemaBuilder {
  table: string;

  fields: Array<string>;

  engine: Engine;

  charset: Charset;

  collate: Collation;

  constructor(table: string, engine: Engine = ENGINES.InnoDB, charset: Charset = CHARSETS.utf8, collate: Collation = COLLATION.utf8_general_ci) {
    this.table = table;
    this.engine = engine;
    this.charset = charset;
    this.collate = collate;
    this.fields = [];
  }

  add(name: string, f: (b: FieldBuilder) => FieldBuilder): SchemaBuilder {
    this.fields.push(f(new FieldBuilder(name)).get());
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
