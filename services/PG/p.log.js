const { Pool } = require('pg');
const pool = new Pool();

async function logToPostgres(level, message) {
  const query = 'INSERT INTO logs (level, message, timestamp) VALUES ($1, $2, NOW())';
  try {
    await pool.query(query, [level, message]);
  } catch (err) {
    console.error('Failed to log to PostgreSQL', err);
  }
}

module.exports = logToPostgres;
