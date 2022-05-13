INSERT INTO department (name)
VALUES 
    ('accounting'),
    ('marketing'),
    ('legal');

INSERT INTO roles (title, salary, department_id)
VALUES ('bookkeeper', 50000, 1),
       ('analyst', 70000, 2),
       ('lawyer', 111000, 3);

INSERT INTO employees (first_name, last_name, role_id)
VALUES ('Peter', 'Parker', 2),
       ('Tony', 'Stark', 3),
       ('Wade', 'Wilson', 1);