require('dotenv').config();
const inquirer = require('inquirer');
const departmentFunctions = require('./models/department.js');
const employeeFunctions = require('./models/employee.js');
const roleFunctions = require('./models/role.js');


function displayMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'menuChoice',
        message: 'What would you like to do?',
        choices: [
          'View departments',
          'View roles',
          'View employees',
          'Add department',
          'Add role',
          'Add employee',
          'Exit',
        ],
      },
    ])
    .then((answers) => {
      if (answers.menuChoice === 'View departments') {
        departmentFunctions.readDepartments().then(([rows]) => {
          console.table(rows);
          displayMenu();
        });
      } else if (answers.menuChoice === 'View roles') {
        roleFunctions.readRoles().then(([rows]) => {
          console.table(rows);
          displayMenu();
        });
      } else if (answers.menuChoice === 'View employees') {
        employeeFunctions.readEmployees().then(([rows]) => {
          console.table(rows);
          displayMenu();
        });
      } else if (answers.menuChoice === 'Add department') {
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'departmentName',
              message: 'Enter the department name:',
            },
          ])
          .then((departmentAnswer) => {
            departmentFunctions
              .createDepartment(departmentAnswer.departmentName)
              .then(() => {
                console.log('Department added successfully!');
                displayMenu();
              });
          });
      } else if (answers.menuChoice === 'Add role') {
        inquirer
          .prompt([
            {
              type: 'input',
              name: 'title',
              message: "Enter the role's title:",
            },
            {
              type: 'input',
              name: 'salary',
              message: "Enter the role's salary:",
            },
            {
              type: 'input',
              name: 'departmentId',
              message: "Enter the department ID for the role:",
            },
          ])
          .then((roleAnswers) => {
            roleFunctions
              .createRole(roleAnswers.title, roleAnswers.salary, roleAnswers.departmentId)
              .then(() => {
                console.log('Role added successfully!');
                displayMenu();
              })
              .catch((error) => {
                console.error(error);
                displayMenu();
              });
          });
      } else if (answers.menuChoice === 'Add employee') {
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
              type: 'input',
              name: 'roleId',
              message: "Enter the role ID for the employee:",
            },
            {
              type: 'input',
              name: 'managerId',
              message: "Enter the manager ID for the employee (optional):",
            },
          ])
          .then((employeeAnswers) => {
            employeeFunctions
              .createEmployee(
                employeeAnswers.firstName,
                employeeAnswers.lastName,
                employeeAnswers.roleId,
                employeeAnswers.managerId || null
              )
              .then(() => {
                console.log('Employee added successfully!');
                displayMenu();
              })
              .catch((error) => {
                console.error(error);
                displayMenu();
              });
          });
      } else {
        console.log('Goodbye!');
        process.exit();
      }
    });
}

displayMenu();
