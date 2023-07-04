const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create a connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to the database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }

  console.log('Connected to the database.');

  // Perform a simple query
  connection.query('SELECT 1', (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
    } else {
      console.log('Query executed successfully.');
    }

    // Close the connection
    connection.end();
  });
});
