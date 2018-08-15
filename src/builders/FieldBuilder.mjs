// @flow

import type { IndexType, ReferenceOption } from '../constants/schema';

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

export type Option = $Keys<typeof OPTIONS>;

export default class FieldBuilder {
  name: string;

  field: string;

  lastOption: Option;

  constructor(name: string) {
    this.name = name;
    this.field = `\`${name}\` `;
    this.lastOption = OPTIONS.NAME;
  }

  validate(option: Option, options: Array<Option>): void {
    if (!options.includes(this.lastOption)) {
      throw new Error(`Unable to insert ${option} after ${this.lastOption}`);
    }
    this.lastOption = option;
  }

  type(t: string): FieldBuilder {
    this.validate(OPTIONS.TYPE, [OPTIONS.NAME]);
    this.field += `${t} `;
    return this;
  }

  enum(...fields: Array<string | number>): FieldBuilder {
    this.validate(OPTIONS.TYPE, [OPTIONS.NAME]);
    this.field += `enum(${fields.map(f => (typeof f === 'string' ? `'${f}'` : f)).join(', ')}) `;
    return this;
  }

  increment(): FieldBuilder {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += 'AUTO_INCREMENT ';
    return this;
  }

  null(): FieldBuilder {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += 'NULL ';
    return this;
  }

  notNull(): FieldBuilder {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += 'NOT NULL ';
    return this;
  }

  default(value: any, isQuotes: boolean = true): FieldBuilder {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += `DEFAULT ${typeof value === 'string' && isQuotes ? `'${value}'` : value} `;
    return this;
  }

  unique(): FieldBuilder {
    this.validate(OPTIONS.MODIFIER, [OPTIONS.TYPE, OPTIONS.MODIFIER]);
    this.field += 'UNIQUE ';
    return this;
  }

  primary(): FieldBuilder {
    this.validate(OPTIONS.CONSTRAINT, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.CONSTRAINT, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `,PRIMARY KEY (\`${this.name}\`) `;
    return this;
  }

  foreign(): FieldBuilder {
    this.validate(OPTIONS.FOREIGN, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `, FOREIGN KEY (\`${this.name}\`) `;
    return this;
  }

  references(table: string, ...fields: Array<string | number>): FieldBuilder {
    this.validate(OPTIONS.REFERENCES, [OPTIONS.FOREIGN]);
    this.field += `REFERENCES \`${table}\` (\`${fields.join('`, `')}\`) `;
    return this;
  }

  onDelete(option: ReferenceOption): FieldBuilder {
    this.validate(OPTIONS.REFERENCES, [OPTIONS.FOREIGN, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `ON DELETE ${option} `;
    return this;
  }

  onUpdate(option: ReferenceOption): FieldBuilder {
    this.validate(OPTIONS.REFERENCES, [OPTIONS.FOREIGN, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `ON UPDATE ${option} `;
    return this;
  }

  index(): FieldBuilder {
    this.validate(OPTIONS.CONSTRAINT, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.CONSTRAINT, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `, INDEX (\`${this.name}\`) `;
    return this;
  }

  key(): FieldBuilder {
    this.validate(OPTIONS.CONSTRAINT, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.CONSTRAINT, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `, KEY (\`${this.name}\`) `;
    return this;
  }

  using(indexType: IndexType): FieldBuilder {
    this.validate(OPTIONS.USING, [OPTIONS.CONSTRAINT]);
    this.field += `USING ${indexType} `;
    return this;
  }

  check(expr: string): FieldBuilder {
    this.validate(OPTIONS.CONSTRAINT, [OPTIONS.TYPE, OPTIONS.MODIFIER, OPTIONS.CONSTRAINT, OPTIONS.REFERENCES, OPTIONS.USING]);
    this.field += `, CHECK (${expr})`;
    return this;
  }

  get() {
    return this.field;
  }
}
