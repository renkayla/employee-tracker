-- Drop existing tables if they exist
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- Create department table
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) UNIQUE
);

-- Create role table
CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create employee table
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

-- Insert departments
INSERT INTO department (name)
VALUES ('Sales'),
       ('Marketing'),
       ('Finance');

-- Insert roles
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Associate', 50000, 1),
       ('Marketing Manager', 60000, 2),
       ('Financial Analyst', 55000, 3);

-- Insert employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL),
       ('Jane', 'Smith', 2, 1),
       ('Michael', 'Johnson', 3, 1);

-- Generate 10 random employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Sarah', 'Williams', 1, 1),
       ('David', 'Brown', 2, 1),
       ('Emily', 'Jones', 3, 2),
       ('Daniel', 'Davis', 1, 2),
       ('Olivia', 'Miller', 2, 3),
       ('Jacob', 'Wilson', 3, 3),
       ('Sophia', 'Moore', 1, 3),
       ('Liam', 'Anderson', 2, 4),
       ('Ava', 'Taylor', 3, 4);

-- Additional queries for fetching data and modifying records

-- Fetch all departments
SELECT * FROM department;

-- Fetch all roles
SELECT role.id, role.title, role.salary, department.name AS department_name
FROM role
JOIN department ON role.department_id = department.id;

-- Fetch all employees
SELECT employee.id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;

-- Add a department
INSERT INTO department (name)
VALUES ('Department Name');

-- Add a role
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Manager', 70000, 1);

-- Add an employee
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Robert', 'Johnson', 1, NULL);

-- Update an employee's role
UPDATE employee
SET role_id = 2
WHERE id = 1;

-- Additional roles
INSERT INTO role (title, salary, department_id)
VALUES ('Sales Assistant', 40000, 1),
       ('Marketing Specialist', 55000, 2),
       ('Finance Manager', 65000, 3);

-- Additional employees
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Emily', 'Walker', 3, 2),
       ('Daniel', 'Clark', 1, 2),
       ('Olivia', 'Martin', 2, 3),
       ('Jacob', 'Harris', 3, 3),
       ('Sophia', 'Lewis', 1, 3),
       ('Liam', 'Robinson', 2, 4),
       ('Ava', 'Walker', 3, 4);

-- Modify auto-increment behavior
ALTER TABLE department MODIFY id INT AUTO_INCREMENT;
ALTER TABLE role MODIFY id INT AUTO_INCREMENT;
ALTER TABLE employee MODIFY id INT AUTO_INCREMENT;
