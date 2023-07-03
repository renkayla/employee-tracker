const connection = require('../connection');

// Function to create a role
function createRole(title, salary, departmentId) {
  const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
  return connection.promise().query(query, [title, salary, departmentId]);
}

// Function to read roles
function readRoles() {
  const query = 'SELECT * FROM role';
  return connection.promise().query(query);
}

// Function to update a role
function updateRole(id, newTitle, newSalary, newDepartmentId) {
  const query = 'UPDATE role SET title = ?, salary = ?, department_id = ? WHERE id = ?';
  return connection.promise().query(query, [newTitle, newSalary, newDepartmentId, id]);
}

// Function to delete a role
function deleteRole(id) {
  const query = 'DELETE FROM role WHERE id = ?';
  return connection.promise().query(query, [id]);
}

module.exports = {
  createRole,
  readRoles,
  updateRole,
  deleteRole,
};
