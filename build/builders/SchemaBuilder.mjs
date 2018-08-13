//

import DB from '../DB';
import FieldBuilder from './FieldBuilder';
import { ENGINES, CHARSETS, COLLATION } from '../constants/schema';


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
