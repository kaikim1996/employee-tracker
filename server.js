//required packages
const inquirer = require('inquirer');
const mysql = require('mysql2');

//connects to mySQL db 
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        port: 3306,
        password: '',
        database: 'employee_db'
    }

)

//testing connection
db.getConnection((err, connection) => {
    if (err) {
      console.error('Database connection failed:', err);
      return;
    }
  
    console.log('Connected to the database.');

//main menu 
function main() {
    const menuOptions =
    {
        type: 'list',
        message: 'Choose from the following options:',
        name: 'answer',
        choices: [
            'View all Departments',
            'View all Roles',
            'View all Employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Quit'
        ]
    }
    //takes user to the choice selected from the menu
    prompt(menuOptions)
        .then((response) => {
            switch (response.answer) {
                case 'View all Departments': 
                    viewDept();
                    break;
                case 'View all Roles':
                    viewRoles();
                    break;
                case 'View all Employees':
                    viewEmployees();
                    break;
                case 'Add a department':
                    addDept();
                    break;
                case 'Add a role':
                     newRole();
                    break;
                case 'Add an employee':
                    newEmployee();
                    break;
                case 'Quit':
                    console.log('Goodbye.')
                    break;
            }
        })
}

//View all Departments
function viewDept() {
    db.query('SELECT * FROM department', (err, result) => {
        console.table(result);
        main();
    });
}


//Add a Department
function addDept() {
    const newDepartment = {
        type: 'input',
        message: 'Input the Name of the Department:',
        name: 'name'
    }
    prompt(newDepartment)
        .then((response) => {
            db.query(`INSERT INTO department (department_name) VALUES ('${response.name}');`, (err, result) => {
                console.log('The department has been successfully added.');
                menu(); //return to menu
            })
        })
    }


//View all Roles
function viewRoles() {
    db.query('SELECT role.id, role.title, department.department_name, role.salary FROM role JOIN department ON role.department_id = department.id', (err, result) => {
        console.table(result);
        main();
    });
}

//Add New Role
function newRole() {
    let departments = [];
    db.query('SELECT department_name FROM department;', (err, result) => {
        result.forEach(element => {
            departments.push(element.department_name);

        });


        const new_role = [{
            type: 'input',
            message: 'Title of role?',
            name: 'title'
        }, {
            type: 'input',
            message: 'Salary?>',
            name: 'salary'
        }, {
            type: 'list',
            message: 'Department?',
            name: 'department',
            choices: departments
        }];
        prompt(new_role)
            .then((response) => {
                const id = departments.indexOf(response.department) + 1;

                db.query(`INSERT INTO role (title, salary, department_id) VALUES ('${response.title}',${response.salary},${id});`, (err1, result1) => {
                    console.log('Role has been added.');
                    mainMenu();
                })
            })

    })
}

//View all Employees
function viewEmployees() {
    db.query(
        'SELECT e.id, e.first_name, e.last_name, role.title, department.department_name, role.salary, CONCAT(m.first_name, \' \', m.last_name) AS manager FROM employee e LEFT JOIN employee m ON e.manager_id = m.id JOIN role ON e.role_id = role.id JOIN department ON role.department_id = department.id; ', (err, result) => {
        console.table(result);
        main();
    })
}


//Add an Employee 
function newEmployee() {
    let roles = [];
    let managers = ['None'];
    db.query('SELECT title FROM role;', (err, result) => {
        result.forEach(element => roles.push(element.title));
        db.query('SELECT first_name,last_name FROM employee', (err2, result2) => {

            result2.forEach(person => {
                managers.push(person.first_name + ' ' + person.last_name);
            })
            const new_employee = [{
                type: 'input',
                message: 'Name of Employee?',
                name: 'firstName'
            }, {
                type: 'input',
                message: 'Last name of Employee?',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'Role of employee?',
                name: 'role',
                choices: roles
            },
            {
                type: 'list',
                message: 'Manager of employee?',
                name: 'manager',
                choices: managers
            }];

            prompt(new_employee)
                .then((response) => {
                    const roleId = roles.indexOf(response.role) + 1;

                    const managerId = response.manager === 'None' ? 'null' : managers.indexOf(response.manager);

                    db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ('${response.firstName}','${response.lastName}',${roleId},${managerId})`, (err3, result3) => {
                        console.log('Employee has been successfully added.');
                        main()})
                })

        })

    })
}
