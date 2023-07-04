const connection = require('../connection');
require('dotenv').config();

// Function to create a department
function createDepartment(departmentName) {
  const query = 'INSERT INTO department (name) VALUES (?)';
  return connection.promise().query(query, [departmentName]);
}

// Function to read departments
function readDepartments() {
  const query = 'SELECT * FROM department';
  return connection.promise().query(query);
}

// Function to update a department
function updateDepartment(id, newName) {
  const query = 'UPDATE department SET name = ? WHERE id = ?';
  return connection.promise().query(query, [newName, id]);
}

// Function to delete a department
function deleteDepartment(id) {
  const query = 'DELETE FROM department WHERE id = ?';
  return connection.promise().query(query, [id]);
}

module.exports = {
  createDepartment,
  readDepartments,
  updateDepartment,
  deleteDepartment,
};
