var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
const cTable = require('console.table');


var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "buster123",
    database: "emp_trackerDB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log(" ");
    console.log(chalk.blue(" ---------------------------------------------------------------"));
    console.log(chalk.blue("|                     #########     #########                   |"));
    console.log(chalk.blue("|                                                               |"))
    console.log(chalk.blue("|                     ###              ###                      |"));
    console.log(chalk.blue("|                                                               |"))
    console.log(chalk.blue("|                     ########         ###                      |"));
    console.log(chalk.blue("|                                                               |"))
    console.log(chalk.blue("|                     ###              ###                      |"));
    console.log(chalk.blue("|                                                               |"))
    console.log(chalk.blue("|  E M P L O Y E E    #########        ###       T R A C K E R  |"));
    console.log(chalk.blue(" ---------------------------------------------------------------"));
    console.log(" ");
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View departments",
                "Add a department",
                "View roles",
                "Add a role",
                "View employees",
                "Add employee",
                "Update employe role",
                "Exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View departments":
                    viewDept();
                    break;

                case "Add a department":
                    addDept();
                    break;

                case "View roles":
                    viewRoles();
                    break;

                case "Add a role":
                    addRole();
                    break;

                case "View employees":
                    viewEmployees();
                    break;

                case "Add employee":
                    addEmp();
                    break;

                case "Update employee role":
                    addEmp();
                    break;

                case "Exit":
                    connection.end();
                    break;



            }
        });
}


function viewDept() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {

        console.table(res);
        connection.end();


    });
}

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {

        console.table(res);
        connection.end();


    });
}
function viewEmployees() {

    var query = "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name as Department, ";
    query += "CONCAT(em.first_name, ' ', em.last_name) as Manager FROM employee e INNER JOIN role r ON r.id = e.role_id ";
    query += "inner join department d ON d.id = r.department_id LEFT JOIN employee em ON e.manager_id = em.id";
    connection.query(query, function (err, res) {
        console.log(err);
        console.table(res);
        connection.end();
    });
}

function addDept() {
    inquirer.prompt({
        name: "department",
        type: "input",
        message: "Enter the Department name"
    }).then(function (answer) {
        connection.query("INSERT INTO department SET ?",
            {
                name: answer.department
            },
            function (err, res) {
                if (err) throw err;
                console.log("The deparment was entered successfully!");
                connection.end();
            });
    });
}



let choiceRole = [];
let choiceMan = [];
let choiceDept = [];

function getempRoles() {
    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {

            choiceRole.push(results[i].title);
        }
    });
}

function getempMan() {
    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        for (let i = 0; i < results.length; i++) {
            let fName = results[i].first_name;
            let lName = results[i].last_name;
            let manName = fName.concat(' ', lName);
            choiceMan.push(manName);
        }
    })
}


function getDeptid() {
   connection.query("SELECT * FROM role", function (err, results){
     if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            choiceDept.push(results[i].name);
        }
        // return choiceDept;
    })
}


function addEmp() {
    getempRoles();
    getempMan();

    inquirer.prompt([
        {
            name: "firstname",
            type: "input",
            message: "Enter the first name"
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter the last name"
        },

        {
            name: "role",
            type: "list",
            choices: choiceRole,
            message: "What is the role?"
        },

        {
            name: "manager",
            type: "list",
            choices: choiceMan,
            message: "Who is the manager?"
        }
    ]).then(function (answers) {
        connection.query("SELECT * FROM role WHERE ?",
            {
                title: answers.role,
            },
            function (err, res) {
                if (err) throw err;
                let roleId = res[0].id;
                console.log(roleId);
                let revName = answers.manager.split(" ");
                let revFname = revName[0];
                let revLname = revName[1];
                connection.query("SELECT * FROM employee WHERE ? AND ?",
                    [{ first_name: revFname },
                    { last_name: revLname }],
                    function (err, res) {
                        if (err) throw err;
                         newManid = res[0].id
                        console.log(newManid)

                        return insertEmp(answers, roleId, newManid);
                    })
            })

    }
    )
}


function insertEmp(answers, roleId, newManid) {
    connection.query("INSERT INTO employee SET ?",
        {
            first_name: answers.firstname,
            last_name: answers.lastname,
            role_id: roleId,
            manager_id: newManid
        },
        function (err, res) {
            if (err) throw err;
            console.log("The employee was entered successfully!");
            connection.end();

        });
};

function addRole() {
    getDeptid();
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "Enter Title"
            },
            {

                name: "salary",
                type: "input",
                message: "Enter salary"
            },
            {
                name: "choice",
                type: "list",
                choices: choiceDept,
                message: "Select a department"
            }

        ]).then(function (answers) {
        
        connection.query("SELECT * FROM department WHERE ?",
        { 
            name: answers.choice,
        },

        function (err, res) {
            if (err) throw err;
             let newDeptid = res[0].id
            console.log(newDeptid);

       
            connection.query("INSERT INTO role SET ?",
                {
                    title: results.title,
                    salary: results.salary,
                    department_id: newDeptid
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("The role was entered successfully!");
                    connection.end();
                });
        });
    });
}

