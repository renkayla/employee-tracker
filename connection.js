const mysql = require('mysql2');

// Create the connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
});

// Export the connection
module.exports = connection;
