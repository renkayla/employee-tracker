const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a connection from the pool
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error getting database connection:', err);
    return;
  }

  // Upgrade the connection to use Promises
  const connectionPromise = connection.promise();

  // Execute your queries asynchronously using Promises
  connectionPromise.query('DROP TABLE IF EXISTS employee')
    .then(() => connectionPromise.query('DROP TABLE IF EXISTS role'))
    .then(() => connectionPromise.query('DROP TABLE IF EXISTS department'))
    .then(() => connectionPromise.query('CREATE TABLE department (id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(30) UNIQUE)'))
    .then(() => connectionPromise.query('CREATE TABLE role (id INT PRIMARY KEY AUTO_INCREMENT, title VARCHAR(30), salary DECIMAL, department_id INT, FOREIGN KEY (department_id) REFERENCES department(id))'))
    .then(() => connectionPromise.query('CREATE TABLE employee (id INT PRIMARY KEY AUTO_INCREMENT, first_name VARCHAR(30), last_name VARCHAR(30), role_id INT, manager_id INT, FOREIGN KEY (role_id) REFERENCES role(id), FOREIGN KEY (manager_id) REFERENCES employee(id))'))
    .then(() => connectionPromise.query("INSERT INTO department (name) VALUES ('Sales'), ('Marketing'), ('Finance')"))
    .then(() => connectionPromise.query("INSERT INTO role (title, salary, department_id) VALUES ('Sales Associate', 50000, 1), ('Marketing Manager', 60000, 2), ('Financial Analyst', 55000, 3)"))
    .then(() => connectionPromise.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Smith', 2, 1), ('Michael', 'Johnson', 3, 1)"))
    .then(() => {
      // Additional queries for fetching data and modifying records
      return connectionPromise.query('SELECT * FROM department');
    })
    .then(([departments, fields]) => {
      console.log('Departments:', departments);
      // Handle the results of the query
    })
    .catch((err) => {
      console.error('Error executing queries:', err);
    })
    .finally(() => {
      // Release the connection back to the pool
      connection.release();
    });
});
