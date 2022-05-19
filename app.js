const inquirer = require('inquirer');
const db = require('./db/connection');
const consoleTable = require('console.table');
const util = require('util');
const { devNull } = require('os');

db.query = util.promisify(db.query);

function beginSelection () {
    return inquirer.prompt([{
        type: 'list',
        name: 'menu',
        message: 'Please choose one of the following options:',
        choices: [
            'View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role'
        ]
    }])
    .then(({ menu }) => {
        if(menu === 'View all departments') {
            viewAllDepartments();
        } else if (menu === 'View all roles') {
            viewAllRoles();
        } else if (menu === 'View all employees') {
            viewAllEmployees();
        } else if (menu === 'Add a department') {
            addDepartmentPrompt();
        } else if (menu === 'Add a role') {
            addRolePrompt();
        } else if (menu === 'Add an employee') {
            addEmployeePrompt();
        } else if (menu === 'Update an employee role') {
            updateEmployeeRole();
        }
    });
}

function finishSelection() {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'finish',
            message: 'Press enter to finish'
        }
    ])
    .then((answer) => {
        if (answer.finish) return beginSelection();
    });
}

function viewAllDepartments() {
    const sql = `SELECT * FROM department`;
    db.connect(err => {
        if (err) throw err;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.table(result);
            finishSelection();
        });
    })
    
}

function viewAllRoles() {
    const sql = `SELECT * FROM roles`;
    db.connect(err => {
        if (err) throw err;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.table(result);
            finishSelection();
        });
    });
    
}

function viewAllEmployees() {
    const sql = `SELECT * FROM employees;`;
    db.connect(err => {
        if (err) throw err;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.table(result);
            finishSelection();
        })
    });
    
}

function addDepartmentPrompt() {
    return inquirer.prompt([{
        tpye: 'text',
        name: 'departmentName',
        message: 'Please enter the name of the department you wish to add',
        validate: departmentNameInput => {
            if (departmentNameInput) {
                return true;
            } else {
                console.log('Please enter the department name!');
                return false;
            }
        }
    }])
    .then(({ departmentName }) => {
        const sql = `INSERT INTO department (name) VALUES ('${departmentName}')`;
        db.connect(err => {
            if (err) throw err;
            db.query(sql, (err, result) => {
                if (err) throw err;
                finishSelection();
            })
        })
    })
    

}

function addRolePrompt() {
    const sql = `SELECT * FROM department;` 
    db.promise().query(sql)
    .then(([rows]) =>{
        // console.log(rows);
        let departments = rows;
        const departmentChoices = departments.map(({ id, name }) =>({
            name: name,
            value: id
        }))
        // console.log('==============');
        // console.log(departmentChoices);
        return inquirer.prompt([
        {
            tpye: 'text',
            name: 'title',
            message: 'Please enter the name of the role',
            validate: titleInput => {
                if (titleInput) {
                    return true;
                } else {
                    console.log('Please enter the name of the role!');
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'salary',
            message: 'Please enter the salary for this role',
            validate: salaryInput => {
                if (salaryInput) {
                    return true;
                } else {
                    console.log('Please enter a salary for this role!');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'departmentRole',
            message: 'Please choose the corresponding department for this role',
            choices: departmentChoices,
        }
    ])
    .then(({ title, salary, departmentRole }) => {
        const sql = `INSERT INTO roles (title, salary, department_id)
                     VALUES ('${title}', '${salary}', '${departmentRole}')`
        db.connect(err => {
            if (err) throw err;
            db.query(sql, (err, result) => {
                if (err) throw err;
                finishSelection();
            });
        });
    });
})
}

function addEmployeePrompt() {
    const sql = `SELECT * FROM roles;`
    db.promise().query(sql)
    .then(([rows]) => {
        // console.log(rows);
        let roles = rows;
        const rolesChoices = roles.map(({ id, title }) =>({
            name: title,
            value: id
        }))
        // console.log('============');
        // console.log(rolesChoices);
        return inquirer.prompt([
            {
                tpye: 'text',
                name: 'firstName',
                message: 'Please enter the first name of the employee',
                validate: firstNameInput => {
                    if (firstNameInput) {
                        return true;
                    } else {
                        console.log('Please enter the first name of the employee!');
                        return false;
                    }
                }
            },
            {
                type: 'text',
                name: 'lastName',
                message: 'Please enter the last name of the employee',
                validate: lastNameInput => {
                    if (lastNameInput) {
                        return true;
                    } else {
                        console.log('Please enter the last name of the employee!');
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'role',
                message: 'Please choose the role for this employee',
                choices: rolesChoices,
            },
            {
                type: 'text',
                name: 'manager',
                message: 'Please enter the first and last name of the employees manager',
                validate: managerInput => {
                    if (managerInput) {
                        return true;
                    } else {
                        console.log('Please enter the managers name');
                        return false;
                    }
                }
            }
        ])
        .then(({ firstName, lastName, role, manager }) => {
            const sql = `INSERT INTO employees (first_name, last_name, role_id, reporting_manager)
                         VALUES ('${firstName}', '${lastName}', '${role}', '${manager}');`
            db.connect(err => {
                if (err) throw err;
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    finishSelection();
                });
            });
        });
    });
}

function updateEmployeeRole() {
    const sql = `SELECT * FROM employees;`
    db.promise().query(sql)
    .then(([rows]) => {
        let employees = rows;
        var employeeNames = employees.map(({ id, first_name, last_name }) =>({
            name: `${first_name} ${last_name}`,
            value: id
        }))
        return inquirer.prompt([
            {
                type: 'list',
                name: 'chooseEmployee',
                message: 'Please choose the employee whose role you would like to update',
                choices: employeeNames
            }      
        
        ])
        .then(({ chooseEmployee }) => {
            var data = chooseEmployee;
            roleForUpdatedEmployee(data);
            // console.log(data);
        });
        
    });
}

function roleForUpdatedEmployee(data) {
    db.promise().query(`SELECT * FROM roles;`)
    .then(([rows]) => {
        let roles = rows;
        const rolesChoices = roles.map(({ id, title }) => ({
            name: title,
            value: id
        }))
        return inquirer.prompt([
            {
                type: 'list',
                name: 'chooseUpdatedRole',
                message: 'Please choose a role to update for the employee',
                choices: rolesChoices
            }
        ])
        .then(({ chooseUpdatedRole }) => {
            const sql = `UPDATE employees SET role_id = '${chooseUpdatedRole}' where id = '${data}';`;
            // const params = [req.params.id];
            db.connect(err => {
                if (err) throw err;
                db.query(sql, (err, result) => {
                    if (err) throw err;
                    finishSelection();
                });
            });
        })
    });
}

//     const sql = `UPDATE voters SET email = ? WHERE id = ?`;
//     const params = [req.body.email, req.params.id];

beginSelection();