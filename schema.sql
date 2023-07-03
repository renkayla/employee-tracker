CREATE TABLE department (
  id INT PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

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
INSERT INTO department (id, name)
VALUES (1, 'Sales');
INSERT INTO department (id, name)
VALUES (2, 'Marketing');
INSERT INTO department (id, name)
VALUES (3, 'Finance');

-- Insert roles
INSERT INTO role (id, title, salary, department_id)
VALUES (1, 'Sales Associate', 50000, 1);
INSERT INTO role (id, title, salary, department_id)
VALUES (2, 'Marketing Manager', 60000, 2);
INSERT INTO role (id, title, salary, department_id)
VALUES (3, 'Financial Analyst', 55000, 3);
-- Add more roles as needed...

-- Insert employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'John', 'Doe', 1, NULL);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (2, 'Jane', 'Smith', 2, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (3, 'Michael', 'Johnson', 3, 1);
-- Add more employees as needed...

-- Generate 10 random employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (4, 'Sarah', 'Williams', 1, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (5, 'David', 'Brown', 2, 1);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (6, 'Emily', 'Jones', 3, 2);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (7, 'Daniel', 'Davis', 1, 2);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (8, 'Olivia', 'Miller', 2, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (9, 'Jacob', 'Wilson', 3, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (10, 'Sophia', 'Moore', 1, 3);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (11, 'Liam', 'Anderson', 2, 4);
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (12, 'Ava', 'Taylor', 3, 4);

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
VALUES ('Sales Manager', 70000, 1); -- Department ID 1

-- Add an employee
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (13, 'Robert', 'Johnson', 1, NULL); -- Role ID 1, No Manager

-- Update an employee's role
UPDATE employee
SET role_id = 2
WHERE id = 1; -- Employee ID 1, Assigning new Role ID 2 (Marketing Manager)

-- Additional roles
INSERT INTO role (id, title, salary, department_id)
VALUES (4, 'Sales Assistant', 40000, 1); -- Department ID 1
INSERT INTO role (id, title, salary, department_id)
VALUES (5, 'Marketing Specialist', 55000, 2); -- Department ID 2
INSERT INTO role (id, title, salary, department_id)
VALUES (6, 'Finance Manager', 65000, 3); -- Department ID 3
-- Add more roles as needed...

-- Additional employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (14, 'Emily', 'Walker', 3, 2); -- Role ID 3, Manager ID 2 (Jane Smith)
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (15, 'Daniel', 'Clark', 1, 2); -- Role ID 1, Manager ID 2 (Jane Smith)
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (16, 'Olivia', 'Martin', 2, 3); -- Role ID 2, Manager ID 3 (Michael Johnson)
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (17, 'Jacob', 'Harris', 3, 3); -- Role ID 3, Manager ID 3 (Michael Johnson)
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (18, 'Sophia', 'Lewis', 1, 3); -- Role ID 1, Manager ID 3 (Michael Johnson)
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (19, 'Liam', 'Robinson', 2, 4); -- Role ID 2, Manager ID 4 (Sarah Williams)
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (20, 'Ava', 'Walker', 3, 4); -- Role ID 3, Manager ID 4 (Sarah Williams)
-- Add more employees as needed...
