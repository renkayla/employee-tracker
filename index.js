require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');

// Create a connection to the MySQL database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'employee_tracker'
});

// Connect to the database
connection.connect((err) => {
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
        'Exit'
      ]
    })
    .then((answer) => {
      switch (answer.action) {
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
        case 'View total utilized budget of a department':
          viewDepartmentBudget();
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
        case 'View employees by manager name': 
          viewEmployeesByManagerName();
          break;
        case 'Delete employee':
          deleteEmployee();
          break;
        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          break;
      }
    });
}

// Function to view employees by manager name
/*function viewEmployeesByManagerName() {
  connection.query('SELECT DISTINCT manager_id, CONCAT(manager.first_name, " ", manager.last_name) AS manager_name FROM employee JOIN employee AS manager ON employee.manager_id = manager.id', (err, managers) => {
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
        connection.query(
          'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE employee.manager_id = ?',
          [managerId],
          (err, employees) => {
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
}*/

// Function to update an employee's manager
function updateEmployeeManager() {
  connection.query('SELECT * FROM employee', (err, employees) => {
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
        connection.query(
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
function viewEmployeesByManager() {
  inquirer
    .prompt({
      type: 'input',
      name: 'managerId',
      message: 'Enter the ID of the manager to view employees:'
    })
    .then((answer) => {
      const managerId = answer.managerId;
      connection.query(
        'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE employee.manager_id = ?',
        [managerId],
        (err, employees) => {
          if (err) {
            console.error('Error fetching employees by manager: ' + err.stack);
            return;
          }
          console.table(employees);
          start();
        }
      );
    });
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) {
      console.error('Error fetching departments: ' + err.stack);
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
}

// Function to view the total utilized budget of a department
function viewDepartmentBudget() {
  connection.query(
    'SELECT department.name AS department_name, SUM(role.salary) AS utilized_budget FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id GROUP BY department.id',
    (err, budgets) => {
      if (err) {
        console.error('Error fetching department budgets: ' + err.stack);
        return;
      }
      console.table(budgets);
      start();
    }
  );
}

// Function to delete a department
function deleteDepartment() {
  connection.query('SELECT * FROM department', (err, departments) => {
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
        connection.query('DELETE FROM department WHERE id = ?', [departmentId], (err, result) => {
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
function deleteRole() {
  connection.query('SELECT * FROM role', (err, roles) => {
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
        connection.query('DELETE FROM role WHERE id = ?', [roleId], (err, result) => {
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

// Function to delete an employee
function deleteEmployee() {
  connection.query(
    'SELECT employee.id, employee.first_name, employee.last_name FROM employee',
    (err, employees) => {
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
          connection.query('DELETE FROM employee WHERE id = ?', [employeeId], (err, result) => {
            if (err) {
              console.error('Error deleting employee: ' + err.stack);
              return;
            }
            console.log('Employee deleted successfully!');
            start();
          });
        });
    }
  );
}

// Function to update an employee's manager
function updateEmployeeManager() {
  connection.query('SELECT * FROM employee', (err, employees) => {
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
        connection.query(
          'UPDATE employee SET manager_id = ? WHERE id = ?',
          [managerId, employeeId],
          (err, result) => {
            if (err) {
              console.error('Error updating employee manager: ' + err.stack);
              return;
            }
            console.log('Employee manager updated successfully!');
            start();
          }
        );
      });
  });
}


// Function to view departments
function viewDepartments() {
  connection.query('SELECT * FROM department', (err, departments) => {
    if (err) {
      console.error('Error fetching departments: ' + err.stack);
      return;
    }
    console.table(departments);
    start();
  });
}

// Function to view roles
function viewRoles() {
  connection.query(
    'SELECT role.id, role.title, role.salary, department.name AS department_name FROM role JOIN department ON role.department_id = department.id',
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

// Function to view employees
function viewEmployees() {
  connection.query(
    'SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department_name FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id',
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

// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: "Enter the department's name:"
    })
    .then((answer) => {
      connection.query('INSERT INTO department SET ?', { name: answer.name }, (err, result) => {
        if (err) {
          console.error('Error adding department: ' + err.stack);
          return;
        }
        console.log('Department added successfully!');
        start();
      });
    });
}

// Function to add a role
function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'title',
        message: "Enter the role's title:"
      },
      {
        type: 'input',
        name: 'salary',
        message: "Enter the role's salary:"
      },
      {
        type: 'input',
        name: 'department_id',
        message: "Enter the role's department ID:"
      }
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO role SET ?',
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department_id
        },
        (err, result) => {
          if (err) {
            console.error('Error adding role: ' + err.stack);
            return;
          }
          console.log('Role added successfully!');
          start();
        }
      );
    });
}

// Function to add an employee
function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'first_name',
        message: "Enter the employee's first name:"
      },
      {
        type: 'input',
        name: 'last_name',
        message: "Enter the employee's last name:"
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the employee's role ID:"
      },
      {
        type: 'input',
        name: 'manager_id',
        message: "Enter the employee's manager ID:"
      }
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO employee SET ?',
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id
        },
        (err, result) => {
          if (err) {
            console.error('Error adding employee: ' + err.stack);
            return;
          }
          console.log('Employee added successfully!');
          start();
        }
      );
    });
}

// Function to update an employee's role
function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'employee_id',
        message: "Enter the ID of the employee you want to update:"
      },
      {
        type: 'input',
        name: 'role_id',
        message: "Enter the new role ID for the employee:"
      }
    ])
    .then((answer) => {
      connection.query(
        'UPDATE employee SET role_id = ? WHERE id = ?',
        [answer.role_id, answer.employee_id],
        (err, result) => {
          if (err) {
            console.error('Error updating employee role: ' + err.stack);
            return;
          }
          console.log('Employee role updated successfully!');
          start();
        }
      );
    });
}