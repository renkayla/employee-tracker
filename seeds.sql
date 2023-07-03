-- departments
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Finance');

-- roles
INSERT INTO role (title, salary, department_name) VALUES
  ('Sales Associate', 50000, 'Sales'),
  ('Marketing Manager', 60000, 'Marketing'),
  ('Financial Analyst', 55000, 'Finance');

-- employees
INSERT INTO employee (first_name, last_name, job_title, department, salary, manager) VALUES
  ('Sophia', 'Moore', 'Sales Associate', 'Sales', 50000, 'Michael Johnson'),
  ('Daniel', 'Davis', 'Sales Associate', 'Sales', 50000, 'Jane Smith'),
  ('Sarah', 'Williams', 'Sales Associate', 'Sales', 50000, 'John Doe'),
  ('John', 'Doe', 'Sales Associate', 'Sales', 50000, NULL),
  ('Liam', 'Anderson', 'Marketing Manager', 'Marketing', 60000, 'Sarah Williams'),
  ('Olivia', 'Miller', 'Marketing Manager', 'Marketing', 60000, 'Michael Johnson'),
  ('David', 'Brown', 'Marketing Manager', 'Marketing', 60000, 'John Doe'),
  ('Jane', 'Smith', 'Marketing Manager', 'Marketing', 60000, 'John Doe'),
  ('Ava', 'Taylor', 'Financial Analyst', 'Finance', 55000, 'Sarah Williams');
