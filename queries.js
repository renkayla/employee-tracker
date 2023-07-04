const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prompt user to select an action from the main menu
inquirer
  .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View departments',
        'View roles',
        'View employees',
        'Add department',
        'Add role',
        'Add employee',
        'Update employee role',
        'Exit'
      ]
    }
  ])
  .then(answer => {
    const action = answer.action;

    switch (action) {
      case 'View departments':
        viewDepartments();
        break;
      case 'View roles':
        viewRoles();
        break;
      case 'View employees':
        viewEmployees();
        break;
      case 'Add department':
        addDepartment();
        break;
      case 'Add role':
        addRole();
        break;
      case 'Add employee':
        addEmployee();
        break;
      case 'Update employee role':
        updateEmployeeRole(); // Call the function to update employee role
        break;
      case 'Exit':
        exit();
        break;
      default:
        console.log('Invalid action');
    }
  })
  .catch(error => {
    console.error('Error:', error);
    pool.end(); // Close the connection pool
  });

// Function to view departments
function viewDepartments() {
  const selectQuery = 'SELECT * FROM department';
  pool.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching departments:', error);
    } else {
      console.table(results);
    }
    pool.end(); // Close the connection pool
  });
}

// Function to view roles
function viewRoles() {
  const selectQuery =
    'SELECT role.id, role.title, role.salary, department.name AS department_name FROM role JOIN department ON role.department_id = department.id';
  pool.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching roles:', error);
    } else {
      console.table(results);
    }
    pool.end(); // Close the connection pool
  });
}

// Function to view employees
function viewEmployees() {
  const selectQuery =
    'SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id';
  pool.query(selectQuery, (error, results) => {
    if (error) {
      console.error('Error fetching employees:', error);
    } else {
      console.table(results);
    }
    pool.end(); // Close the connection pool
  });
}

// Function to add a department
function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the department name:'
      }
    ])
    .then(answer => {
      const name = answer.name;
      const insertQuery = 'INSERT INTO department (name) VALUES (?)';
      pool.query(insertQuery, [name], (error, results) => {
        if (error) {
          console.error('Error adding department:', error);
        } else {
          console.log('Department added successfully!');
        }
        pool.end(); // Close the connection pool
      });
    })
    .catch(error => {
      console.error('Error:', error);
      pool.end(); // Close the connection pool
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the role title:'
      },
      {
        type: 'number',
        name: 'salary',
        message: 'Enter the role salary:'
      },
      {
        type: 'number',
        name: 'departmentId',
        message: 'Enter the department ID:'
      }
    ])
    .then(answer => {
      const title = answer.title;
      const salary = answer.salary;
      const departmentId = answer.departmentId;
      const insertQuery = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
      pool.query(insertQuery, [title, salary, departmentId], (error, results) => {
        if (error) {
          console.error('Error adding role:', error);
        } else {
          console.log('Role added successfully!');
        }
        pool.end(); // Close the connection pool
      });
    })
    .catch(error => {
      console.error('Error:', error);
      pool.end(); // Close the connection pool
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'firstName',
        message: "Enter the employee's first name:"
      },
      {
        type: 'input',
        name: 'lastName',
        message: "Enter the employee's last name:"
      },
      {
        type: 'number',
        name: 'roleId',
        message: "Enter the employee's role ID:"
      },
      {
        type: 'number',
        name: 'managerId',
        message: "Enter the employee's manager ID (if applicable):",
        default: null
      }
    ])
    .then(answer => {
      const firstName = answer.firstName;
      const lastName = answer.lastName;
      const roleId = answer.roleId;
      const managerId = answer.managerId;
      const insertQuery =
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
      pool.query(insertQuery, [firstName, lastName, roleId, managerId], (error, results) => {
        if (error) {
          console.error('Error adding employee:', error);
        } else {
          console.log('Employee added successfully!');
        }
        pool.end(); // Close the connection pool
      });
    })
    .catch(error => {
      console.error('Error:', error);
      pool.end(); // Close the connection pool
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
  const updateQuery =
    'UPDATE employee SET role_id = ? WHERE id = ?';

  // Fetch employee choices
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
  pool.query(employeeQuery, (error, employees) => {
    if (error) {
      console.error('Error fetching employees:', error);
      pool.end(); // Close the connection pool
      return;
    }

    // Fetch role choices
    const roleQuery = 'SELECT id, title FROM role';
    pool.query(roleQuery, (error, roles) => {
      if (error) {
        console.error('Error fetching roles:', error);
        pool.end(); // Close the connection pool
        return;
      }

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employees.map(employee => ({
              name: employee.name,
              value: employee.id
            }))
          },
          {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role:',
            choices: roles.map(role => ({
              name: role.title,
              value: role.id
            }))
          }
        ])
        .then(answer => {
          const employeeId = answer.employeeId;
          const roleId = answer.roleId;

          pool.query(updateQuery, [roleId, employeeId], (error, results) => {
            if (error) {
              console.error('Error updating employee role:', error);
            } else {
              console.log('Employee role updated successfully!');
            }
            pool.end(); // Close the connection pool
          });
        })
        .catch(error => {
          console.error('Error:', error);
          pool.end(); // Close the connection pool
        });
    });
  });
}

// Function to exit the application
function exit() {
  pool.end(); // Close the connection pool
}
