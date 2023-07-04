const mysql = require('mysql2');
require('dotenv').config();

// Create the connection
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Export the connection
module.exports = connection;
