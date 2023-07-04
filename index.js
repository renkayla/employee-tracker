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
        'Add department',
        'Add role',
        'Add employee',
        'Update employee role',
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
        case 'Exit':
          connection.end();
          console.log('Goodbye!');
          break;
      }
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