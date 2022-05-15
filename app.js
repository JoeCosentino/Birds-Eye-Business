const inquirer = require('inquirer');

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
        }
    });
}

function viewAllDepartments() {
    
}

beginSelection();