const mysql = require('mysql2/promise');
const log = require('../utils/logger');

const pool = mysql.createPool({
  connectionLimit: 200,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Database Connection established');
    connection.release();
  } catch (err) {
    switch (err.code) {
      case 'PROTOCOL_CONNECTION_LOST':
        console.error('Database connection was closed.');
        break;
      case 'ER_CON_COUNT_ERROR':
        console.error('Database has too many connections.');
        break;
      case 'ECONNREFUSED':
        console.error('Database connection was refused.');
        break;
      default:
        console.error('Database connection error:', err);
    }
  }

  if (process.env.NODE_ENV === 'dev') {
    pool.on('acquire', (connection) => {
      console.log(`Connection ${connection.threadId} acquired`);
    });

    pool.on('release', (connection) => {
      console.log(`Connection ${connection.threadId} released`);
    });
  }

  pool.on('enqueue', () => {
    log.warn('Waiting for available connection slot');
  });
}

initDatabase();

module.exports = pool;
