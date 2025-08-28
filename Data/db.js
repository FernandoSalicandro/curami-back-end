// Data/db.js
import mysql from 'mysql2';

const connection = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQLHOST || '127.0.0.1',
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASS || process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
  database: process.env.DB_DATABASE || process.env.DB_NAME || process.env.MYSQLDATABASE || 'curami_db',
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10_000
});

// log di prova (rimetti pure a off dopo i test)
connection.query('SELECT 1', (err) => {
  if (err) {
    console.error('MySQL connection failed:', err);
  } else {
    console.log('MySQL connected.');
  }
});

export default connection;
