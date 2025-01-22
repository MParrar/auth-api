const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.NODE_ENV === 'test' ? process.env.PG_TEST_USER : process.env.PG_USER,
  host: process.env.NODE_ENV === 'test' ? process.env.PG_TEST_HOST : process.env.PG_HOST,
  database: process.env.NODE_ENV === 'test' ? process.env.PG_TEST_DATABASE : process.env.PG_DATABASE,
  password:  process.env.NODE_ENV === 'test' ? process.env.PG_TEST_PASSWORD : process.env.PG_PASSWORD,
  port:  process.env.NODE_ENV === 'test' ? process.env.PG_TEST_PORT : process.env.PG_PORT,
});

module.exports = pool;
