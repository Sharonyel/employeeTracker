USE emp_trackerDB;

INSERT INTO department (name)
VALUES ("Accounting"), ("Human Resources"), ("Technology"), ("Shipping"), ("Administration");

SELECT * FROM department;

INSERT INTO role (title, salary, department_id)
VALUES ("VP", 100000.00, 12), ("Sr VP", 150000.00, 10), ("Manager", 53000.00, 10), ("Team Leader", 44000.00, 11), ("Director", 47000.00, 12);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michelle", "Obama", 200, 3003), ("Gary", "Owens", 203, 3002), ("Jackie", "Wang", 203, 3000), ("Oprah", "Winfrey", 201, 3001), ("Olivia", "Pope", 203, 3002);


SELECT * FROM employee;