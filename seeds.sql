-- departments
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Finance');

-- roles
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Associate', 50000, 1),
  ('Marketing Manager', 60000, 2),
  ('Financial Analyst', 55000, 3);

-- employees
INSERT INTO employee (first_name, last_name, job_title, department_id, salary, manager) VALUES
  ('Sophia', 'Moore', 'Sales Associate', 1, 50000, 'Michael Johnson'),
  ('Daniel', 'Davis', 'Sales Associate', 1, 50000, 'Jane Smith'),
  ('Sarah', 'Williams', 'Sales Associate', 1, 50000, 'John Doe'),
  ('John', 'Doe', 'Sales Associate', 1, 50000, NULL),
  ('Liam', 'Anderson', 'Marketing Manager', 2, 60000, 'Sarah Williams'),
  ('Olivia', 'Miller', 'Marketing Manager', 2, 60000, 'Michael Johnson'),
  ('David', 'Brown', 'Marketing Manager', 2, 60000, 'John Doe'),
  ('Jane', 'Smith', 'Marketing Manager', 2, 60000, 'John Doe'),
  ('Ava', 'Taylor', 'Financial Analyst', 3, 55000, 'Sarah Williams');
