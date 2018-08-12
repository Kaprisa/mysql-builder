import 'mjs-mocha';
import chai from 'chai';
import SchemaBuilder from '../builders/SchemaBuilder';
import FieldBuilder from '../builders/FieldBuilder';
import { normalize } from '../../build/utils/string';
import { REFERENCE_OPTIONS, INDEX_TYPES } from '../constants/schema';

const { expect } = chai;

describe('Schema Builder', () => {
  it('Creates fields correctly', () => {
    const field = (new FieldBuilder('id'))
      .type('int(11)')
      .increment()
      .notNull()
      .primary()
      .get();

    expect(normalize(field)).to.equal(normalize('`id` int(11) AUTO_INCREMENT NOT NULL ,PRIMARY KEY (`id`) '));
  });

  it('Creates schema correctly', () => {
    const schema = (new SchemaBuilder('users'))
      .add('id', f => f.type('int(11)').increment().notNull().primary())
      .add('email', f => f.type('varchar(50)').notNull().unique())
      .add('name', f => f.type('varchar(50)').nullable())
      .add('type', f => f.type('varchar(30)').index().using(INDEX_TYPES.BTREE))
      .add('book_id', f => f.type('int(11)').notNull().foreign().references('books', 'id')
        .onDelete(REFERENCE_OPTIONS.CASCADE))
      .build();
    expect(normalize(schema)).to.equal(normalize(`CREATE TABLE \`users\` (
      \`id\` int(11) AUTO_INCREMENT NOT NULL ,PRIMARY KEY (\`id\`) ,
      \`email\` varchar(50) NOT NULL UNIQUE ,
      \`name\` varchar(50) NULL ,
      \`type\` varchar(30) ,
      INDEX (\`type\`) USING BTREE ,
      \`book_id\` int(11) NOT NULL ,
      FOREIGN KEY (\`book_id\`) REFERENCES \`books\` (\`id\`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8  COLLATE=utf8_general_ci`));
  });
});
