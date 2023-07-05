require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Connect to the database
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);

  // Start the application
  start();
});

// Function to start the application
function start() {
  inquirer
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View departments',
        'View roles',
        'View employees',
        'View employees by manager',
        'View employees by department',
        'View total utilized budget of a department',
        'Add department',
        'Add role',
        'Add employee',
        'Update employee role',
        'Update employee manager',
        'Delete department',
        'Delete role',
        'Delete employee',
        'View employees by manager name',
        'Exit'
      ]
    })
    .then((answer) => {
      const action = answer.action;

      switch (action) {
        case 'View departments':
          viewDepartments(pool);
          break;
        case 'View roles':
          viewRoles(pool);
          break;
        case 'View employees':
          viewEmployees(pool);
          break;
        case 'View employees by manager':
          viewEmployeesByManager(pool);
          break;
        case 'View employees by department':
          viewEmployeesByDepartment(pool);
          break;
        case 'View total utilized budget of a department':
          viewDepartmentBudget(pool);
          break;
        case 'Add department':
          addDepartment(pool);
          break;
        case 'Add role':
          addRole(pool);
          break;
        case 'Add employee':
          addEmployee(pool);
          break;
        case 'Update employee role':
          updateEmployeeRole(pool);
          break;
        case 'Update employee manager':
          updateEmployeeManager(pool);
          break;
        case 'Delete department':
          deleteDepartment(pool);
          break;
        case 'Delete role':
          deleteRole(pool);
          break;
        case 'View employees by manager name':
          viewEmployeesByManagerName(pool);
          break;
        case 'Delete employee':
          deleteEmployee(pool);
          break;
        case 'Exit':
          pool.end();
          console.log('Goodbye!');
          break;
        default:
          console.log('Invalid action');
      }
    });
}

// Function to view departments
function viewDepartments(pool) {
  const query = 'SELECT * FROM department';
  pool.query(query, (err, departments) => {
    if (err) {
      console.error('Error fetching departments: ' + err.stack);
      return;
    }
    console.table(departments);
    start();
  });
}

// Function to view roles
function viewRoles(pool) {
  const query = 'SELECT * FROM role';
  pool.query(query, (err, roles) => {
    if (err) {
      console.error('Error fetching roles: ' + err.stack);
      return;
    }
    console.table(roles);
    start();
  });
}

// Function to view employees
function viewEmployees(pool) {
  const query =
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name ' +
    'FROM employee ' +
    'JOIN role ON employee.role_id = role.id ' +
    'JOIN department ON role.department_id = department.id ' +
    'LEFT JOIN employee AS manager ON employee.manager_id = manager.id';

  pool.query(query, (err, employees) => {
    if (err) {
      console.error('Error fetching employees: ' + err.stack);
      return;
    }

    console.table(employees);
    start();
  });
}

function viewEmployeesByManagerName(pool) {
  const query =
    'SELECT DISTINCT employee.manager_id, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name ' +
    'FROM employee ' +
    'JOIN employee AS manager ON employee.manager_id = manager.id';

  pool.query(query, (err, managers) => {
    if (err) {
      console.error('Error fetching managers: ' + err.stack);
      return;
    }

    inquirer
      .prompt({
        type: 'list',
        name: 'managerId',
        message: 'Select the manager to view employees:',
        choices: managers.map((manager) => ({
          name: manager.manager_name,
          value: manager.manager_id,
        })),
      })
      .then((answer) => {
        const managerId = answer.managerId;
        const employeesQuery =
          'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name ' +
          'FROM employee ' +
          'JOIN role ON employee.role_id = role.id ' +
          'JOIN department ON role.department_id = department.id ' +
          'WHERE employee.manager_id = ?';

        pool.query(employeesQuery, [managerId], (err, employees) => {
          if (err) {
            console.error('Error fetching employees by manager: ' + err.stack);
            return;
          }
          console.table(employees);
          start();
        });
      });
  });
}



// Function to update an employee's manager
function updateEmployeeManager(pool) {
  pool.query('SELECT * FROM employee', (err, employees) => {
    if (err) {
      console.error('Error fetching employees: ' + err.stack);
      return;
    }
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to update:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          type: 'list',
          name: 'managerId',
          message: "Select the employee's new manager:",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
      ])
      .then((answer) => {
        const employeeId = answer.employeeId;
        const managerId = answer.managerId;
        pool.query(
          'UPDATE employee SET manager_id = ? WHERE id = ?',
          [managerId, employeeId],
          (err, result) => {
            if (err) {
              console.error('Error updating employee manager: ' + err.stack);
              return;
            }
            console.log('Employee manager updated successfully!');
            start(); // Call the start function again to display the main menu
          }
        );
      });
  });
}


// Function to view employees by manager
function viewEmployeesByManager(pool) {
  inquirer
    .prompt({
      type: 'input',
      name: 'managerId',
      message: 'Enter the ID of the manager to view employees:'
    })
    .then((answer) => {
      const managerId = answer.managerId;
      pool.getConnection((err, connection) => {
        if (err) {
          console.error('Error getting database connection: ' + err.stack);
          return;
        }
        connection.query(
          'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE employee.manager_id = ?',
          [managerId],
          (err, employees) => {
            connection.release(); // Release the connection back to the pool
            if (err) {
              console.error('Error fetching employees by manager: ' + err.stack);
              return;
            }
            console.table(employees);
            start();
          }
        );
      });
    });
}


// Function to view employees by department
function viewEmployeesByDepartment(pool) {
  pool.getConnection((err, connection) => {
    if (err) {
      console.error('Error getting database connection: ' + err.stack);
      return;
    }
    connection.query('SELECT * FROM department', (err, departments) => {
      if (err) {
        console.error('Error fetching departments: ' + err.stack);
        connection.release(); // Release the connection back to the pool
        return;
      }
      inquirer
        .prompt({
          type: 'list',
          name: 'departmentId',
          message: 'Select the department to view employees:',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        })
        .then((answer) => {
          const departmentId = answer.departmentId;
          connection.query(
            'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = ?',
            [departmentId],
            (err, employees) => {
              connection.release(); // Release the connection back to the pool
              if (err) {
                console.error('Error fetching employees by department: ' + err.stack);
                return;
              }
              console.table(employees);
              start();
            }
          );
        });
    });
  });
}


// Function to view the total utilized budget of a department
function viewDepartmentBudget(pool) {
  const query =
    'SELECT department.name AS department_name, SUM(role.salary) AS utilized_budget ' +
    'FROM employee ' +
    'JOIN role ON employee.role_id = role.id ' +
    'JOIN department ON role.department_id = department.id ' +
    'GROUP BY department.id';

  pool.query(query, (err, budgets) => {
    if (err) {
      console.error('Error fetching department budgets: ' + err.stack);
      return;
    }
    console.table(budgets);
    start();
  });
}


// Function to delete a department
function deleteDepartment(pool) {
  pool.query('SELECT * FROM department', (err, departments) => {
    if (err) {
      console.error('Error fetching departments: ' + err.stack);
      return;
    }
    inquirer
      .prompt({
        type: 'list',
        name: 'departmentId',
        message: 'Select the department to delete:',
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      })
      .then((answer) => {
        const departmentId = answer.departmentId;
        const deleteQuery = 'DELETE FROM department WHERE id = ?';
        pool.query(deleteQuery, [departmentId], (err, result) => {
          if (err) {
            console.error('Error deleting department: ' + err.stack);
            return;
          }
          console.log('Department deleted successfully!');
          start();
        });
      });
  });
}

// Function to delete a role
function deleteRole(pool) {
  pool.query('SELECT * FROM role', (err, roles) => {
    if (err) {
      console.error('Error fetching roles: ' + err.stack);
      return;
    }
    inquirer
      .prompt({
        type: 'list',
        name: 'roleId',
        message: 'Select the role to delete:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      })
      .then((answer) => {
        const roleId = answer.roleId;
        pool.query('DELETE FROM role WHERE id = ?', [roleId], (err, result) => {
          if (err) {
            console.error('Error deleting role: ' + err.stack);
            return;
          }
          console.log('Role deleted successfully!');
          start();
        });
      });
  });
}

//function to delete an employee
function deleteEmployee(pool) {
  pool.query('SELECT * FROM employee', (err, employees) => {
    if (err) {
      console.error('Error fetching employees: ' + err.stack);
      return;
    }
    inquirer
      .prompt({
        type: 'list',
        name: 'employeeId',
        message: 'Select the employee to delete:',
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      })
      .then((answer) => {
        const employeeId = answer.employeeId;
        const deleteQuery = 'DELETE FROM employee WHERE id = ?';

        pool.query(deleteQuery, [employeeId], (err, result) => {
          if (err) {
            console.error('Error deleting employee: ' + err.stack);
            return;
          }
          console.log('Employee deleted successfully!');
          start();
        });
      });
  });
}


// Function to update an employee's manager
function updateEmployeeManager(pool) {
  pool.query('SELECT * FROM employee', (err, employees) => {
    if (err) {
      console.error('Error fetching employees: ' + err.stack);
      return;
    }
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select the employee to update:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          type: 'list',
          name: 'managerId',
          message: "Select the employee's new manager:",
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
      ])
      .then((answer) => {
        const employeeId = answer.employeeId;
        const managerId = answer.managerId;
        pool.query(
          'UPDATE employee SET manager_id = ? WHERE id = ?',
          [managerId, employeeId],
          (err, result) => {
            if (err) {
              console.error('Error updating employee manager: ' + err.stack);
              return;
            }
            console.log('Employee manager updated successfully!');
            start(); // Call the start function again to display the main menu
          }
        );
      });
  });
}



// Function to add a department
function addDepartment(pool) {
  inquirer
    .prompt({
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:',
    })
    .then((answer) => {
      const departmentName = answer.departmentName;
      const query = 'INSERT INTO department (name) VALUES (?)';
      pool.query(query, [departmentName], (err, result) => {
        if (err) {
          console.error('Error adding department: ' + err.stack);
          return;
        }
        console.log('Department added successfully!');
        start(); // Call the start function again to display the main menu
      });
    });
}




// Function to add a role
function addRole(pool) {
  // Fetch departments from the database to populate the choices
  const departmentsQuery = 'SELECT * FROM department';
  pool.query(departmentsQuery, (err, departments) => {
    if (err) {
      console.error('Error fetching departments: ' + err.stack);
      return;
    }

    inquirer
      .prompt([
        {
          type: 'input',
          name: 'roleTitle',
          message: 'Enter the title of the role:',
        },
        {
          type: 'number',
          name: 'roleSalary',
          message: 'Enter the salary of the role:',
        },
        {
          type: 'list',
          name: 'departmentId',
          message: 'Select the department of the role:',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answers) => {
        const { roleTitle, roleSalary, departmentId } = answers;
        const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
        pool.query(query, [roleTitle, roleSalary, departmentId], (err, result) => {
          if (err) {
            console.error('Error adding role: ' + err.stack);
            return;
          }
          console.log('Role added successfully!');
          start(); // Call the start function again to display the main menu
        });
      });
  });
}




// Function to add an employee
function addEmployee(pool) {
  // Fetch roles from the database to populate the choices
  const rolesQuery = 'SELECT * FROM role';
  pool.query(rolesQuery, (err, roles) => {
    if (err) {
      console.error('Error fetching roles: ' + err.stack);
      return;
    }

    // Fetch employees from the database to populate the choices for manager selection
    const employeesQuery = 'SELECT * FROM employee';
    pool.query(employeesQuery, (err, employees) => {
      if (err) {
        console.error('Error fetching employees: ' + err.stack);
        return;
      }

      inquirer
        .prompt([
          {
            type: 'input',
            name: 'firstName',
            message: "Enter the employee's first name:",
          },
          {
            type: 'input',
            name: 'lastName',
            message: "Enter the employee's last name:",
          },
          {
            type: 'list',
            name: 'roleId',
            message: "Select the employee's role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
                     {
              type: 'list',
              name: 'managerId',
              message: "Select the employee's manager:",
              choices: employees.map((employee) => ({
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id,
              })),
            },
          ])
          .then((answers) => {
            const { firstName, lastName, roleId, managerId } = answers;
            const query =
              'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
            pool.query(
              query,
              [firstName, lastName, roleId, managerId],
              (err, result) => {
                if (err) {
                  console.error('Error adding employee: ' + err.stack);
                  return;
                }
                console.log('Employee added successfully!');
                start(); // Call the start function again to display the main menu
              }
            );
          });
      });
  });
}



// Function to update an employee's role
function updateEmployeeRole(pool) {
  // Fetch employees from the database to populate the choices
  const employeesQuery = 'SELECT * FROM employee';
  pool.query(employeesQuery, (err, employees) => {
    if (err) {
      console.error('Error fetching employees: ' + err.stack);
      return;
    }

    // Fetch roles from the database to populate the choices
    const rolesQuery = 'SELECT * FROM role';
    pool.query(rolesQuery, (err, roles) => {
      if (err) {
        console.error('Error fetching roles: ' + err.stack);
        return;
      }

      inquirer
        .prompt([
          {
            type: 'list',
            name: 'employeeId',
            message: 'Select the employee to update:',
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            type: 'list',
            name: 'roleId',
            message: 'Select the new role for the employee:',
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answers) => {
          const { employeeId, roleId } = answers;
          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          pool.query(query, [roleId, employeeId], (err, result) => {
            if (err) {
              console.error('Error updating employee role: ' + err.stack);
              return;
            }
            console.log('Employee role updated successfully!');
            start(); // Call the start function again to display the main menu
          });
        });
    });
  });
}


 