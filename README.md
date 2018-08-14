## Mysql query builder

### DB

- Specify database env variables MYSQL_USER, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT

```js
import DB from 'mysql-builder'

DB.query(queryString, params) // -> Promise<Array<RowType>> - all rows
DB.queryRow(queryString, params) // -> Promise<?RowType> - first row
```

### Builders

- Field builder

```js
import { FieldBuilder } from 'mysql-builder';

const field = (new FieldBuilder('id')) // -> FieldBuilder
      .type('int(11)') // -> FieldBuilder
      .increment() // -> FieldBuilder
      .notNull() // -> FieldBuilder
      .primary() // -> FieldBuilder
      .get() // -> string
```

- This converts to 
```sql
`id` int(11) AUTO_INCREMENT NOT NULL,
PRIMARY KEY (`id`) 
```

- Schema builder

```js
import { SchemaBuilder } from 'mysql-builder';

const schema = (new SchemaBuilder('users'))
      .add('id', f => f.type('int(11)').increment().notNull().primary()) 
      .add('email', f => f.type('varchar(50)').notNull().unique())
      .add('name', f => f.type('varchar(50)').null())
      .add('currency', f => f.enum('RUB', 'USD', 'EUR').notNull().default('RUB'))
      .add('type', f => f.type('varchar(30)').index().using(INDEX_TYPES.BTREE))
      .add('book_id', f => f.type('int(11)').notNull().foreign().references('books', 'id').onDelete(REFERENCE_OPTIONS.CASCADE))
      .key('currency', 'type').unique().using(INDEX_TYPES.HASH)
      /* You can get Schema string */
      .build() // -> string
      /* Or Query to DataBase */
      .create() // -> Promise<void>
```

- This converts to

```sql
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) AUTO_INCREMENT NOT NULL ,PRIMARY KEY (`id`) ,
  `email` varchar(50) NOT NULL UNIQUE ,
  `name` varchar(50) NULL ,
  `currency` enum('RUB', 'USD', 'EUR') NOT NULL DEFAULT 'RUB' ,
  `type` varchar(30) ,
  INDEX (`type`) USING BTREE ,
  `book_id` int(11) NOT NULL ,
  FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE ,
  UNIQUE KEY (`currency`, `type`) USING HASH
) ENGINE=InnoDB DEFAULT CHARSET=utf8  COLLATE=utf8_general_ci
```

- Query builder

```js
import { QueryBuilder } from 'mysql-builder'

const q = (new QueryBuilder('users'))
      .select('name')
      .aggregate(AGGREGATION.SUM, 'age', 'age')
      .where({ name: 'bob' })
      .groupBy('name')
      .having('SUM(age) > 100')
      .sortBy('age', DOWN)
      /* You can get query string */
      .build() // -> string
      /* Or Query to DataBase */
      .get() // -> Promise<Array<DBRow>> 
```

- This converts to

```sql
SELECT `name`, SUM(`age`) age FROM `users` 
WHERE `name`=`bob` 
GROUP BY `name` 
HAVING SUM(age) > 100 
ORDER BY `age` DESC
```

```js
(new QueryBuilder('users'))
      .select()
      .where('age', '>', 5)
      .where('name', 'LIKE', '%e%', 'AND')
      .build();
```

- This converts to

```sql
SELECT * FROM `users` 
WHERE `age` > 5 AND `name` LIKE '%e%'
```


### Models

- Table builder

```js
import { Table } from 'mysql-builder';

const table = new Table('users');

type RowType = {[string]: any};
type ConditionType = number | RowType;

/* all supported methods */
table.insert(params: RowType) // -> Promise<void>
table.replace(params: RowType) // -> Promise<void> (~ insert, on duplicate key update)
table.update(id: ConditionType, params: RowType) // -> Promise<void>
table.delete(id: ConditionType) // -> Promise<void>
table.set(id: ConditionType, field: string, value: any) // -> Promise<void>
table.find(id: ConditionType) // -> Promise<?RowType>
table.all(...fields: Array<string>) // -> Promise<Array<RowType>>
table.first(params: ?RowType) // -> Promise<{[string]: any}>
table.last(params: ?RowType) // -> Promise<{[string]: any}>

```

