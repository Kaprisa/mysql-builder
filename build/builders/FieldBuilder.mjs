//


export const OPTIONS = {
  MODIFIER: 'MODIFIER',
  REFERENCES: 'REFERENCES',
  ON_DELETE: 'ON DELETE',
  ON_UPDATE: 'ON UPDATE',
  USING: 'USING',
  TYPE: 'TYPE',
  NAME: 'NAME',
  CONSTRAINT: 'CONSTRAINT',
  FOREIGN: 'FOREIGN',
};


export default class FieldBuilder {
  constructor(name) {
    this.name = name;
    this.field = `\`${name}\` `;
    this.lastOption = OPTIONS.NAME;
  }

  validate(option, options) {
    if (!options.includes(this.lastOption)) {
      throw new Error(`Unable to insert ${option} after ${this.lastOption}`);
    }
    this.lastOption = option;
  }

  type(t) {
    this.validate(OPTIONS.TYPE, [OPTIONS.NAME]);
    this.field += `${t} `;
    return this;
  }

  enum(...fields) {
    this.validate(OPTIONS.TYPE, [OPTIONS.NAME]);
    this.field += `enum(${fields.map(f => (typeof f === 'string' ? `'${f}'` : f)).join(', ')}) `;
    return this;
  }

  increment() {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += 'AUTO_INCREMENT ';
    return this;
  }

  null() {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += 'NULL ';
    return this;
  }

  notNull() {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += 'NOT NULL ';
    return this;
  }

  default(value, isQuotes = true) {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += `DEFAULT ${typeof value === 'string' && isQuotes ? `'${value}'` : value} `;
    return this;
  }

  unique() {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += 'UNIQUE ';
    return this;
  }

  primary() {
    this.validate(OPTIONS.CONSTRAINT, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.CONSTRAINT, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `,PRIMARY KEY (\`${this.name}\`) `;
    return this;
  }

  foreign() {
    this.validate(OPTIONS.FOREIGN, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `, FOREIGN KEY (\`${this.name}\`) `;
    return this;
  }

  references(table, ...fields) {
    this.validate(OPTIONS.REFERENCES, [OPTIONS.FOREIGN]);
    this.field += `REFERENCES \`${table}\` (\`${fields.join('`, `')}\`) `;
    return this;
  }

  onDelete(option) {
    this.validate(OPTIONS.REFERENCES, [OPTIONS.FOREIGN, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `ON DELETE ${option} `;
    return this;
  }

  onUpdate(option) {
    this.validate(OPTIONS.REFERENCES, [OPTIONS.FOREIGN, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `ON UPDATE ${option} `;
    return this;
  }

  index() {
    this.validate(OPTIONS.CONSTRAINT, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.CONSTRAINT, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `, INDEX (\`${this.name}\`) `;
    return this;
  }

  key() {
    this.validate(OPTIONS.CONSTRAINT, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.CONSTRAINT, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `, KEY (\`${this.name}\`) `;
    return this;
  }

  using(indexType) {
    this.validate(OPTIONS.USING, [OPTIONS.CONSTRAINT]);
    this.field += `USING ${indexType} `;
    return this;
  }

  check(expr) {
    this.validate(OPTIONS.CONSTRAINT, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.CONSTRAINT, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `, CHECK (${expr})`;
    return this;
  }

  get() {
    return this.field;
  }
}
