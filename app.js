const inquirer = require('inquirer');
const db = require('./db/connection');
const consoleTable = require('console.table');

function beginSelection () {
    return inquirer.prompt([{
        type: 'list',
        name: 'menu',
        message: 'Please choose one of the following options:',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee'
        ]
    }])
    .then(({ menu }) => {
        if(menu === 'view all departments') {
            viewAllDepartments();
        } else if (menu === 'view all roles') {
            viewAllRoles();
        } else if (menu === 'view all employees') {
            viewAllEmployees();
        } else if (menu === 'add a department') {
            addDepartmentPrompt();
        }
    });
}

function viewAllDepartments() {
    const sql = `SELECT * FROM department`;
    db.connect(err => {
        if (err) throw err;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.table(result);
        });
    });
}

function viewAllRoles() {
    const sql = `SELECT * FROM roles`;
    db.connect(err => {
        if (err) throw err;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.table(result);
        });
    });
}

function viewAllEmployees() {
    const sql = `SELECT * FROM employees LEFT JOIN roles ON employees.role_id = roles.id;`;
    db.connect(err => {
        if (err) throw err;
        db.query(sql, (err, result) => {
            if (err) throw err;
            console.table(result);
        })
    })
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
        const sql = `INSERT INTO department (name)
                     VALUES`;
        const values = `(${departmentName})`;
        db.connect(err => {
            if (err) throw err;
            db.query(sql, values, (err, result) => {
                if (err) throw err;
                console.table(result);
            })
        })
    })
}

// const sql = `UPDATE voters SET email = ? WHERE id = ?`;
//     const params = [req.body.email, req.params.id];

beginSelection();