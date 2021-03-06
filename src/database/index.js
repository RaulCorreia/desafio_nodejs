const mysql = require('mysql');
const { createTable } = require('./manager');

// Conexão com o BD
const mysqlConnection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (err) {
        console.log('Connection mysql Failed');
    } else {
        console.log('Connected mysql');
        createTable(mysqlConnection);
    }
});

module.exports = mysqlConnection;