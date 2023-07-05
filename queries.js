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

// Enable autocommit mode
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }

  connection.query('SET autocommit = 1', error => {
    connection.release(); // Release the connection
    if (error) {
      console.error('Error enabling autocommit mode: ' + error.stack);
      pool.end(); // Close the connection pool
      return;
    }

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
        'View employees by manager',
        'View employees by department',
        'Add department',
        'Add role',
        'Add employee',
        'Update employee role',
        'Update employee manager',
        'Delete department',
        'Delete role',
        'Delete employee',
        'View total utilized budget of a department',
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
      case 'View employees by manager':
        viewEmployeesByManager();
        break;
      case 'View employees by department':
        viewEmployeesByDepartment();
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
        updateEmployeeRole();
        break;
      case 'Update employee manager':
        updateEmployeeManager();
        break;
      case 'Delete department':
        deleteDepartment();
        break;
      case 'Delete role':
        deleteRole();
        break;
      case 'Delete employee':
        deleteEmployee();
        break;
      case 'View total utilized budget of a department':
        viewTotalUtilizedBudget();
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
  pool.query('SELECT * FROM department', (err, departments) => {
    if (err) {
      console.error('Error fetching departments: ' + err.stack);
      return;
    }
    console.table(departments);
    start();
  });
}

// Function to view employees
function viewEmployees() {
  pool.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name ' +
      'FROM employee ' +
      'JOIN role ON employee.role_id = role.id ' +
      'JOIN department ON role.department_id = department.id',
    (err, employees) => {
      if (err) {
        console.error('Error fetching employees: ' + err.stack);
        return;
      }
      console.table(employees);
      start();
    }
  );
}

// Function to view roles
function viewRoles() {
  pool.query(
    'SELECT role.id, role.title, role.salary, department.name AS department_name ' +
      'FROM role ' +
      'JOIN department ON role.department_id = department.id',
    (err, roles) => {
      if (err) {
        console.error('Error fetching roles: ' + err.stack);
        return;
      }
      console.table(roles);
      start();
    }
  );
}

  //function to view employees by manager
  
function viewEmployeesByManager() {
  const managerQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
  pool.query(managerQuery, (error, managers) => {
    if (error) {
      console.error('Error fetching managers:', error);
      pool.end(); // Close the connection pool
      return;
    }

    console.log('Managers:', managers);

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the manager:',
          choices: managers.map(manager => ({
            name: manager.name,
            value: manager.id
          }))
        }
      ])
      .then(answer => {
        const managerId = answer.managerId;
        console.log('Selected Manager ID:', managerId);

        const selectQuery =
          'SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id WHERE employee.manager_id = ?';
        console.log('Select Query:', selectQuery); // Add this line to log the select query

        pool.query(selectQuery, [managerId], (error, results) => {
          if (error) {
            console.error('Error fetching employees by manager:', error);
          } else {
            console.table(results);
          }
          pool.end(); // Close the connection pool
        });
      })
      .catch(error => {
        console.error('Error:', error);
        pool.end(); // Close the connection pool
      });
  });
}


// Function to view employees by department
function viewEmployeesByDepartment() {
  const departmentQuery = 'SELECT id, name FROM department';
  pool.query(departmentQuery, (error, departments) => {
    if (error) {
      console.error('Error fetching departments:', error);
      pool.end(); // Close the connection pool
      return;
    }

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department:',
          choices: departments.map(department => ({
            name: department.name,
            value: department.id
          }))
        }
      ])
      .then(answer => {
        const departmentId = answer.departmentId;
        const selectQuery =
          'SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id WHERE department.id = ?';
        pool.query(selectQuery, [departmentId], (error, results) => {
          if (error) {
            console.error('Error fetching employees by department:', error);
          } else {
            console.table(results);
          }
          pool.end(); // Close the connection pool
        });
      })
      .catch(error => {
        console.error('Error:', error);
        pool.end(); // Close the connection pool
      });
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
  const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';

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
            message: 'Select the employee:',
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

// Function to update an employee's manager
function updateEmployeeManager() {
  const updateQuery = 'UPDATE employee SET manager_id = ? WHERE id = ?';

  // Fetch employee choices
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
  pool.query(employeeQuery, (error, employees) => {
    if (error) {
      console.error('Error fetching employees:', error);
      pool.end(); // Close the connection pool
      return;
    }

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee:',
          choices: employees.map(employee => ({
            name: employee.name,
            value: employee.id
          }))
        },
        {
          type: 'list',
          name: 'managerId',
          message: 'Select the new manager:',
          choices: employees.map(employee => ({
            name: employee.name,
            value: employee.id
          }))
        }
      ])
      .then(answer => {
        const employeeId = answer.employeeId;
        const managerId = answer.managerId;

        pool.query(updateQuery, [managerId, employeeId], (error, results) => {
          if (error) {
            console.error('Error updating employee manager:', error);
          } else {
            console.log('Employee manager updated successfully!');
          }
          pool.end(); // Close the connection pool
        });
      })
      .catch(error => {
        console.error('Error:', error);
        pool.end(); // Close the connection pool
      });
  });
}

// Function to delete a department
function deleteDepartment() {
  const departmentQuery = 'SELECT id, name FROM department';
  pool.query(departmentQuery, (error, departments) => {
    if (error) {
      console.error('Error fetching departments:', error);
      pool.end(); // Close the connection pool
      return;
    }

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department to delete:',
          choices: departments.map(department => ({
            name: department.name,
            value: department.id
          }))
        }
      ])
      .then(answer => {
        const departmentId = answer.departmentId;

        // Check if there are any roles referencing this department
        const roleQuery = 'SELECT id FROM role WHERE department_id = ?';
        pool.query(roleQuery, [departmentId], (error, roles) => {
          if (error) {
            console.error('Error fetching roles:', error);
            pool.end(); // Close the connection pool
            return;
          }

          if (roles.length > 0) {
            // Delete the roles referencing this department
            const deleteRolesQuery = 'DELETE FROM role WHERE department_id = ?';
            pool.query(deleteRolesQuery, [departmentId], (error, results) => {
              if (error) {
                console.error('Error deleting roles:', error);
                pool.end(); // Close the connection pool
                return;
              }

              // Roles deleted successfully, now delete the department
              const deleteDepartmentQuery = 'DELETE FROM department WHERE id = ?';
              pool.query(deleteDepartmentQuery, [departmentId], (error, results) => {
                if (error) {
                  console.error('Error deleting department:', error);
                } else {
                  console.log('Department deleted successfully!');
                }
                pool.end(); // Close the connection pool
              });
            });
          } else {
            // No roles referencing this department, so delete the department directly
            const deleteDepartmentQuery = 'DELETE FROM department WHERE id = ?';
            pool.query(deleteDepartmentQuery, [departmentId], (error, results) => {
              if (error) {
                console.error('Error deleting department:', error);
              } else {
                console.log('Department deleted successfully!');
              }
              pool.end(); // Close the connection pool
            });
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
        pool.end(); // Close the connection pool
      });
  });
}


// Function to delete a role
function deleteRole() {
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
          name: 'roleId',
          message: 'Select the role to delete:',
          choices: roles.map(role => ({
            name: role.title,
            value: role.id
          }))
        }
      ])
      .then(answer => {
        const roleId = answer.roleId;

        // Check if there are any employees referencing this role
        const employeeQuery = 'SELECT id FROM employee WHERE role_id = ?';
        pool.query(employeeQuery, [roleId], (error, employees) => {
          if (error) {
            console.error('Error fetching employees:', error);
            pool.end(); // Close the connection pool
            return;
          }

          if (employees.length > 0) {
            // Delete the employees referencing this role
            const deleteEmployeesQuery = 'DELETE FROM employee WHERE role_id = ?';
            pool.query(deleteEmployeesQuery, [roleId], (error, results) => {
              if (error) {
                console.error('Error deleting employees:', error);
                pool.end(); // Close the connection pool
                return;
              }

              // Employees deleted successfully, now delete the role
              const deleteRoleQuery = 'DELETE FROM role WHERE id = ?';
              pool.query(deleteRoleQuery, [roleId], (error, results) => {
                if (error) {
                  console.error('Error deleting role:', error);
                } else {
                  console.log('Role deleted successfully!');
                }
                pool.end(); // Close the connection pool
              });
            });
          } else {
            // No employees referencing this role, so delete the role directly
            const deleteRoleQuery = 'DELETE FROM role WHERE id = ?';
            pool.query(deleteRoleQuery, [roleId], (error, results) => {
              if (error) {
                console.error('Error deleting role:', error);
              } else {
                console.log('Role deleted successfully!');
              }
              pool.end(); // Close the connection pool
            });
          }
        });
      })
      .catch(error => {
        console.error('Error:', error);
        pool.end(); // Close the connection pool
      });
  });
}



// Function to delete an employee
function deleteEmployee() {
  const employeeQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
  pool.query(employeeQuery, (error, employees) => {
    if (error) {
      console.error('Error fetching employees:', error);
      pool.end(); // Close the connection pool
      return;
    }

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to delete:',
          choices: employees.map(employee => ({
            name: employee.name,
            value: employee.id
          }))
        }
      ])
      .then(answer => {
        const employeeId = answer.employeeId;
        const deleteQuery = 'DELETE FROM employee WHERE id = ?';
        pool.query(deleteQuery, [employeeId], (error, results) => {
          if (error) {
            console.error('Error deleting employee:', error);
          } else {
            console.log('Employee deleted successfully!');
          }
          pool.end(); // Close the connection pool
        });
      })
      .catch(error => {
        console.error('Error:', error);
        pool.end(); // Close the connection pool
      });
  });
}

// Function to view the total utilized budget of a department
function viewTotalUtilizedBudget() {
    const departmentQuery = 'SELECT id, name FROM department';
    pool.query(departmentQuery, (error, departments) => {
      if (error) {
        console.error('Error fetching departments:', error);
        pool.end(); // Close the connection pool
        return;
      }
  
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'departmentId',
            message: 'Select the department:',
            choices: departments.map(department => ({
              name: department.name,
              value: department.id
            }))
          }
        ])
        .then(answer => {
          const departmentId = answer.departmentId;
          const selectQuery = 'SELECT SUM(role.salary) AS total_utilized_budget FROM employee JOIN role ON employee.role_id = role.id WHERE role.department_id = ?';
          pool.query(selectQuery, [departmentId], (error, results) => {
            if (error) {
              console.error('Error fetching total utilized budget:', error);
            } else {
              console.log('Total Utilized Budget:', results[0].total_utilized_budget);
            }
            pool.end(); // Close the connection pool
          });
        })
        .catch(error => {
          console.error('Error:', error);
          pool.end(); // Close the connection pool
        });
    });
  }
  

// Main menu function
function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'Select an action:',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'View employees by manager',
          'View employees by manager name',
          'View employees by department',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Update an employee manager',
          'Delete a department',
          'Delete a role',
          'Delete an employee',
          'View total utilized budget of a department',
          'Exit'
        ]
      }
    ])
    .then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewDepartments();
          break;
        case 'View all roles':
          viewRoles();
          break;
        case 'View all employees':
          viewEmployees();
          break;
        case 'View employees by manager':
          viewEmployeesByManager();
          break;
        case 'View employees by manager name':
          viewEmployeesByManagerName();
          break;
        case 'View employees by department':
          viewEmployeesByDepartment();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Update an employee manager':
          updateEmployeeManager();
          break;
        case 'Delete a department':
          deleteDepartment();
          break;
        case 'Delete a role':
          deleteRole();
          break;
        case 'Delete an employee':
          deleteEmployee();
          break;
        case 'View total utilized budget of a department':
          viewTotalUtilizedBudget();
          break;
        case 'Exit':
          console.log('Goodbye!');
          pool.end(); // Close the connection pool
          break;
      }
    })
    .catch(error => {
      console.error('Error:', error);
      pool.end(); // Close the connection pool
    });
}

// Call the main menu function
mainMenu();

// Handle termination signal to gracefully close the database connection
process.on('exit', () => {
  pool.end(); // Close the connection pool
});