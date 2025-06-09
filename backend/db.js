const { Pool } = require('pg');
require('dotenv').config(); 

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('connect', () => {
  console.log('Connected to the SQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1); 
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};