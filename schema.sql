DROP DATABASE IF EXISTS emp_trackerDB;
CREATE database emp_trackerDB;

USE emp_trackerDB;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
ALTER TABLE department AUTO_INCREMENT=10;

CREATE TABLE role (
  id INT NOT NULL auto_increment,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL,
  department_id INT,
  PRIMARY KEY (id)
);

ALTER TABLE role AUTO_INCREMENT=200;

create TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id int,
  manager_id int,
  PRIMARY KEY (id)
);
ALTER TABLE employee AUTO_INCREMENT=3000;

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;
