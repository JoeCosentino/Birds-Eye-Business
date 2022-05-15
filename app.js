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

beginSelection();