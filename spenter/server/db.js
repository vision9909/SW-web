// db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '1.253.14.231',
    user: 'spenter',       // 사용자에 맞게 변경
    password: '1234',   // 비밀번호에 맞게 변경
    database: 'spenter',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
