-- SELECT * FROM employee_list;

-- SELECT DATABASE();

-- SELECT *
-- FROM department_list;

-- SELECT *
-- FROM role_list;

-- SELECT employee_list.first_name, employee_list.last_name AS name
-- FROM employee_list;

-- SELECT department_list.dept_name AS department_name
-- FROM department_list
-- JOIN employee_list ON department_list.id = employee_list.department_id;

-- SELECT role_list.title AS title
-- FROM role_list
-- JOIN department_list ON role_list.department_id = department_list.id;

-- SELECT employee_list.role_id AS role_id
-- FROM employee_list
-- JOIN role_list ON employee_list.role_id = role_list.id;

-- SELECT employee_id, COUNT(id) AS number_employees
-- FROM employee_list
-- GROUP BY department_id;
-- ORDER BY department_id ASC;

-- SELECT department_id, COUNT(id) AS number_departments
-- FROM department_list
-- ORDER BY id ASC;

-- SELECT role_id, COUNT(id) AS number_roles
-- FROM role_list
-- GROUP BY id;