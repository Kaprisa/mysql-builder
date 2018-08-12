import MySQLProvider from 'mysql';
import util from 'util';

const pool = MySQLProvider.createPool({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT || 3306,
  database: process.env.MYSQL_DATABASE,
});

pool.query = util.promisify(pool.query);
pool.queryRow = async (q, p) => (await pool.query(q, p))[0];
pool.format = (query, args) => MySQLProvider.format(query, args);

export default pool;
