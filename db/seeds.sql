INSERT INTO department (name)
VALUES 
    ('accounting'),
    ('marketing'),
    ('legal');

INSERT INTO roles (title, salary, department_id)
VALUES ('bookkeeper', 50000, 1),
       ('lawyer', 111000, 3),
       ('analyst', 70000, 2);

INSERT INTO employees (first_name, last_name, role_id, reporting_manager)
VALUES ('Peter', 'Parker', 2, 'Nick Fury'),
       ('Tony', 'Stark', 3, 'Nick Fury'),
       ('Wade', 'Wilson', 1, 'Nick Fury');