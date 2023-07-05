-- Drop existing tables if they exist
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS department;

-- Create department table
CREATE TABLE department (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) UNIQUE,
  total_utilized_budget DECIMAL DEFAULT 0 -- Add the column here
);

-- Create role table
CREATE TABLE role (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT,
  CONSTRAINT role_department_fk FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);


-- Create employee table
CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT,
  manager_id INT,
  CONSTRAINT employee_role_fk FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  CONSTRAINT employee_manager_fk FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
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

      
-- View employees by manager
SELECT * FROM employee WHERE manager_id = 1;

-- View employees by department
SELECT * FROM employee WHERE role_id IN (SELECT id FROM role WHERE department_id = 2);

-- Delete a department
DELETE FROM department WHERE id = 3;

-- Delete a role
DELETE FROM role WHERE id = 2;

-- Delete employees
DELETE FROM employee WHERE id IN (2, 5, 8, 11);

-- Re-establish foreign key constraints
ALTER TABLE role ADD CONSTRAINT role_ibfk_1 FOREIGN KEY (department_id) REFERENCES department(id);
ALTER TABLE employee ADD CONSTRAINT employee_ibfk_1 FOREIGN KEY (role_id) REFERENCES role(id);


-- Update an employee's role
UPDATE employee SET role_id = 3 WHERE id = 7;

-- Update an employee's manager
UPDATE employee SET manager_id = 2 WHERE id = 10;

-- View the total utilized budget of a department
SELECT department.name AS department, SUM(role.salary) AS total_utilized_budget
FROM department
JOIN role ON department.id = role.department_id
JOIN employee ON role.id = employee.role_id
WHERE department.id = 1
GROUP BY department.name;