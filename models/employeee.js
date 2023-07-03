const connection = require('../connection');

// Function to create an employee
function createEmployee(firstName, lastName, roleId, managerId) {
  const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
  return connection.promise().query(query, [firstName, lastName, roleId, managerId]);
}

// Function to read employees
function readEmployees() {
  const query = 'SELECT * FROM employee';
  return connection.promise().query(query);
}

// Function to update an employee
function updateEmployee(id, newFirstName, newLastName, newRoleId, newManagerId) {
  const query = 'UPDATE employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ? WHERE id = ?';
  return connection.promise().query(query, [newFirstName, newLastName, newRoleId, newManagerId, id]);
}

// Function to delete an employee
function deleteEmployee(id) {
  const query = 'DELETE FROM employee WHERE id = ?';
  return connection.promise().query(query, [id]);
}

module.exports = {
  createEmployee,
  readEmployees,
  updateEmployee,
  deleteEmployee,
};
