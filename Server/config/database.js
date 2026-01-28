const mysql = require('mysql2');
require('dotenv').config();

// สร้าง connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'servicereq_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// แปลงเป็น promise-based
const promisePool = pool.promise();

// Test connection
promisePool.getConnection()
  .then(connection => {
    console.log('✅ Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
  });

module.exports = promisePool;