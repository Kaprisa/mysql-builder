import 'mjs-mocha';
import chai from 'chai';
import Table from '../models/Table';
import SchemaBuilder from '../builders/SchemaBuilder';
import { INDEX_TYPES, REFERENCE_OPTIONS } from '../constants/schema';

const { expect } = chai;

const table = new Table('users');
const booksTable = new Table('books');

describe('Table', () => {
  before(async () => {
    const usersBuilder = new SchemaBuilder('users');
    const booksBuilder = new SchemaBuilder('books');
    await booksBuilder.drop();
    await usersBuilder.drop();

    await usersBuilder
      .add('id', f => f.type('int(11)').increment().notNull().primary())
      .add('email', f => f.type('varchar(50)').notNull().unique())
      .add('name', f => f.type('varchar(50)').null())
      .create();

    await booksBuilder
      .add('id', f => f.type('int(11)').increment().notNull().primary())
      .add('title', f => f.type('varchar(50)').null())
      .add('type', f => f.type('varchar(30)').index().using(INDEX_TYPES.BTREE))
      .add('user_id', f => f.type('int(11)').notNull().foreign().references('users', 'id')
        .onDelete(REFERENCE_OPTIONS.CASCADE))
      .create();
  });

  it('Inserts', async () => {
    await table.insert({ email: 'kaprisa57@gmail.com', name: 'Kseniya' });
    const user = await table.find({ email: 'kaprisa57@gmail.com' });
    expect(user.name).to.equal('Kseniya');
  });

  it('Updates', async () => {
    const result = await table.update({ email: 'kaprisa57@gmail.com' }, { name: 'Hello' });
    expect(result.changedRows).to.equal(1);
  });

  it('Removes', async () => {
    await table.delete({ email: 'kaprisa57@gmail.com' });
    const user = await table.find({ email: 'kaprisa57@gmail.com' });
    expect(user).to.be.an('undefined');
  });

  it('Finds first', async () => {
    await table.delete();
    await table.insert({ email: 'u1@gmail.com', name: 'u1' });
    await table.insert({ email: 'u2@gmail.com', name: 'u2' });
    await table.insert({ email: 'u3@gmail.com', name: 'u3' });
    const user = await table.first();
    expect(user.name).to.equal('u1');
  });

  it('Finds last', async () => {
    const user = await table.last();
    expect(user.name).to.equal('u3');
  });

  it('Finds all', async () => {
    const users = await table.all();
    expect(users.length).to.equal(3);
  });

  it('Finds all with selected fields', async () => {
    const ids = (await table.all('id')).map(u => u.id);
    await booksTable.insert({ title: 'a', type: 1, user_id: ids[1] });
    await booksTable.insert({ title: 'b', type: 2, user_id: ids[2] });
    await booksTable.insert({ title: 'c', type: 3, user_id: ids[0] });
    await booksTable.insert({ title: 'd', type: 3, user_id: ids[2] });
    await booksTable.insert({ title: 'e', type: 3, user_id: ids[1] });
    const books = await booksTable.all('user_id');
    expect(books.length).to.equal(5);
    expect(books[0]).to.have.a.property('user_id');
    expect(books[0]).to.not.have.a.property('title');
  });
});
