USE emp_trackerDB;

INSERT INTO department (name)
VALUES ("Accounting"), ("Resources"), ("Technology"), ("Administration");

SELECT * FROM department;



INSERT INTO role (title, salary, department_id)
VALUES ("Manager", 33000, 10), ("Team Leader", 25000, 11), ("Department Manager", 44000, 12);


SELECT * FROM role;


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Michelle", "Obama", 200, 3003), ("Mickey", "Mouse", 201, 3001), ("Olivia", "Pope", 203, 3002);


SELECT * FROM employee;