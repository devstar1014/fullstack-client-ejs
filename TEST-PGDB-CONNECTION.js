require('dotenv').config();
const pool = require('./services/p.db.js');

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Connected to the database successfully!');
    client.release();
  } catch (err) {
    console.error('Error connecting to the database:', err);
  } finally {
    pool.end();
  }
}

testConnection();