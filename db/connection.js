const mysql = require('mysql2');
require('dotenv').config();


// connect to sql database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: process.env.PASSWORD,
      database: 'company'
    },
    console.log('Connected to the election database.')
);

module.exports = db;