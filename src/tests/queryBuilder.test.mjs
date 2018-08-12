import 'mjs-mocha';
import chai from 'chai';
import { DOWN, AGGREGATION } from '../constants/commands';
import QueryBuilder from '../builders/QueryBuilder';

const { expect } = chai;

describe('Query Builder', () => {
  it('Creates query correctly', () => {
    const q = (new QueryBuilder('users'))
      .select('name')
      .aggregate(AGGREGATION.SUM, 'age', 'age')
      .where({ name: 'bob' })
      .groupBy('name')
      .having('SUM(age) > 100')
      .sortBy('age', DOWN)
      .build();

    expect(q).to.equal('SELECT `name`, SUM(`age`) age FROM `users` WHERE `name`=`bob` GROUP BY `name` HAVING SUM(age) > 100 ORDER BY `age` DESC ');
  });
});
