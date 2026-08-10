const { Pool } = require("pg");

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pesca_deportiva',
  password: 'hGUIg_u362ygS@_42',
  port: 5432,
});

module.exports = pool;
