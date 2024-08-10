const pool = require('./p.db');

async function getPostgresLogs() {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY timestamp DESC');
    return result.rows;
  } catch (error) {
    console.error('Failed to fetch PostgreSQL logs:', error);
    throw error;
  }
}

module.exports = getPostgresLogs;
