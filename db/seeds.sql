INSERT INTO department (department_name)
VALUES ('Human Resources'),
       ('Marketing'),
       ('Sales');
       ('Computers and Informatics')

INSERT INTO role (title, salary,department_id)
VALUES ('HR Manager',100,1),
       ('Associate Salesperson',900,3),
       ('Lead Engineer',50000,3),
       ('Software Engineer', 9000,4),
       ('Marketing',100000,2);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ('Kaitlyn','Kim',1,2),
       ('Olivia','Fanet',3,null),
       ('Albert','Andrews',6,3),
       ('Caroline','Howard',2,1),
       ('Tommy','Smith',4,2);

