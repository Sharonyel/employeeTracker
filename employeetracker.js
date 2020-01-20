var mysql = require("mysql");
var inquirer = require("inquirer");
const chalk = require('chalk');
const cTable = require('console.table');
var choiceRole = [];
var choiceMan = [];
var choiceDept = [];

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
                "Update employee Info",
                "View departments",
                "Add a department",
                "View roles",
                "Add a role",
                "View employees",
                "Add employee",
                "Delete employee",
                "Delete department",
                "Delete role",
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

                case "Update employee Info":
                    updateEmpInfo();
                    break;

                case "Delete employee":
                    deleteEmp();
                    break;

                case "Delete department":
                    deleteDept();
                    break;

                case "Delete role":
                    deleteRole();
                    break;

                case "Exit":
                    connection.end();
                    break;

            }
        });
}

function updateEmpInfo() {

    const empName = [];
    const empIdupd = [];

    connection.query("SELECT id, CONCAT(first_name,' ', last_name) as name FROM employee", function (err, results) {

        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            empName.push(results[i].name)
            empIdupd.push(results[i].id)
        }

        inquirer.prompt([
            {
                name: "empchoice",
                type: "list",
                message: "Choose the employee to update?",
                choices: empName
            },
            {
                name: "updatechoice",
                type: "list",
                message: "What would you like to update?",
                choices: ["Role", "Manager"]
            }
        ]).then(function (answer) {
            if (err) throw err;
            let empupdName = answer.empchoice.split(" ")

            if (answer.updatechoice === "Manager") {
                updateManager(empupdName);
            } else
                if (answer.updatechoice === "Role") {
                    updateRole(empupdName);
                }
        })

    })
}

function updateManager(empupdName) {
    const managers = [];
    const empIdno = [];

    connection.query("SELECT id, CONCAT(first_name,' ', last_name) as name FROM employee", function (err, results) {

        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            managers.push(results[i].name)
            empIdno.push(results[1].id)

        }
        inquirer.prompt(

            {
                name: "manchoice",
                type: "list",
                message: "Select a new manager",
                choices: managers
            }

        ).then(function (answer) {
            let manName = answer.manchoice.split(' ');
            connection.query('SELECT id FROM employee WHERE ? AND ?',
                [{
                    first_name: manName[0]
                },
                {
                    last_name: manName[1]
                }],

                function (err, results) {
                    if (err) throw err;
                    let manId = results[0].id;
                    console.log("man id " + manId)

                    connection.query('SELECT id FROM employee WHERE ? AND ?',
                        [{
                            first_name: empupdName[0]
                        },
                        {
                            last_name: empupdName[1]
                        }],

                        function (err, results) {
                            if (err) throw err;
                            //   let emmanId = results[0].id
                        })

                    connection.query("UPDATE employee SET ? WHERE ?",
                        [{
                            manager_id: manId
                        },
                        {
                            id: results[0].id
                        }],
                        function (err, results) {
                            if (err) throw err;

                            console.log(chalk.green("The employee " + empupdName[0] + " " + empupdName[1] + "'s manager has been updated"));
                            runSearch();

                        })
                })

        })
    })
}




function updateRole(empupdName) {
    const roles = [];

    connection.query("SELECT id, title FROM role", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            roles.push(results[i].title)

        }
        inquirer.prompt(

            {
                name: "rolechoice",
                type: "list",
                message: "Select new role",
                choices: roles
            }

        ).then(function (answer) {
            connection.query('SELECT id FROM employee WHERE ? AND ?',
                [{
                    first_name: empupdName[0]
                },
                {
                    last_name: empupdName[1]
                }],

                function (err, results) {
                    if (err) throw err;
                    empId = results[0].id;
                    console.log("name id " + empId)
                    connection.query("SELECT id FROM role WHERE ?",
                        {
                            title: answer.rolechoice
                        },
                        function (err, results) {
                            if (err) throw err;
                            let roleId = results[0].id;
                            console.log("role id " + roleId)

                            console.log("rolechoice " + answer.rolechoice)
                            connection.query("UPDATE employee SET ? WHERE ?",
                                [{
                                    role_id: roleId
                                },
                                {
                                    id: empId
                                }],
                                function (err, res) {
                                    if (err) throw err;

                                    console.log(chalk.green("The employee " + empupdName[0] + " " + empupdName[1] + "'s role has been updated"));
                                    runSearch();
                                })
                        })
                })

        })
    })
}

function viewDept() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, res) {
        console.table(res);
        runSearch();


    });
}

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function (err, res) {

        console.table(res);
        runSearch();


    });
}
function viewEmployees() {

    var query = "SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name as Department, ";
    query += "CONCAT(em.first_name, ' ', em.last_name) as Manager FROM employee e INNER JOIN role r ON r.id = e.role_id ";
    query += "inner join department d ON d.id = r.department_id LEFT JOIN employee em ON e.manager_id = em.id";
    connection.query(query, function (err, res) {
        console.table(res);
        runSearch();
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
                console.log(chalk.green("The department " + answer.department + " was entered successfully!"));
                runSearch();
            });
    });
}




function getempRoles() {
    choiceRole = [];

    connection.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        choiceRole.length = 0;
        for (var i = 0; i < results.length; i++) {

            choiceRole.push(results[i].title);
        }
    });
}

function getempMan() {
    choiceMan = [];

    connection.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        choiceMan.length = 0;
        for (let i = 0; i < results.length; i++) {
            let fName = results[i].first_name;
            let lName = results[i].last_name;
            let manName = fName.concat(' ', lName);
            choiceMan.push(manName);
        }
    })
}


function getDeptid() {
    choiceDept = [];
    connection.query("SELECT * FROM department", function (err, results) {
        if (err) throw err;

        for (var i = 0; i < results.length; i++) {
            choiceDept.push(results[i].name);
        }
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
                        connection.query("INSERT INTO employee SET ?",
                            {
                                first_name: answers.firstname,
                                last_name: answers.lastname,
                                role_id: roleId,
                                manager_id: newManid
                            },
                            function (err, res) {
                                if (err) throw err;
                                // console.log(first_name)
                                console.log(chalk.green("The employee " + answers.firstname + " " + answers.lastname + " " + "was entered successfully!"));
                                runSearch();

                            });
                    })
            })

    }
    )
}

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
                console.log(res)


                connection.query("INSERT INTO role SET ?",
                    {
                        title: answers.title,
                        salary: answers.salary,
                        department_id: newDeptid
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(chalk.green("The role " + answers.title + "was entered successfully!"));
                        runSearch();
                    });
            });
    });
}

function deleteEmp() {
    let names = [];
    connection.query("SELECT id, CONCAT(first_name,' ', last_name) as name FROM employee", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            names.push(res[i].name)
        }

        inquirer.prompt([{
            name: "delete",
            type: "list",
            message: "Choose the employee to delete?",
            choices: names
        },
        {
            name: "confirm",
            type: "list",
            message: "Are you sure you want to delete this person?",
            choices: ["Yes", "No"]
        }

        ]).then(function (answer) {
            if (answer.confirm === "Yes") {
                let names = answer.delete.split(" ")

                connection.query("SELECT id FROM employee WHERE ? AND ?",
                    [{ first_name: names[0] },
                    { last_name: names[1] }],
                    function (err, results) {
                        if (err) throw err;
                        connection.query("DELETE FROM employee WHERE id = ?", results[0].id, function (err, res) {
                            if (err) throw err;

                            console.log(chalk.green("Deleted " + answer.delete + " from the database"));

                            runSearch();

                        })
                    })
            }
            else {
                runSearch();

            }

        })
    })
}

function deleteDept() {
    let depts = [];
    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            depts.push(res[i].name)
        }

        inquirer.prompt([{
            name: "delete",
            type: "list",
            message: "Choose the department to delete?",
            choices: depts
        },
        {
            name: "confirm",
            type: "list",
            message: "Are you sure you want to delete this person?",
            choices: ["Yes", "No"]
        }

        ]).then(function (answer) {
            if (answer.confirm === "Yes") {
                console.log("depts " + answer.delete)
                connection.query("SELECT id FROM department WHERE ?",
                    { name: answer.delete },
                    function (err, results) {
                        if (err) throw err;
                        console.log("dept id " + results[0].id)
                        connection.query("DELETE FROM department WHERE ?",
                            { id: results[0].id },

                            function (err, res) {
                                if (err) throw err;

                                console.log(chalk.green("Deleted " + answer.delete + " from the database"));

                                runSearch();

                            })
                    })
            }
            else {
                runSearch();

            }

        })
    })
}
function deleteRole() {
    let roles = [];
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            roles.push(res[i].title)
        }

        inquirer.prompt([{
            name: "delete",
            type: "list",
            message: "Choose the role to delete?",
            choices: roles
        },
        {
            name: "confirm",
            type: "list",
            message: "Are you sure you want to delete this person?",
            choices: ["Yes", "No"]
        }

        ]).then(function (answer) {
            if (answer.confirm === "Yes") {
                console.log("roles " + answer.delete)
                connection.query("SELECT id FROM role WHERE ?",
                    { title: answer.delete },
                    function (err, results) {
                        if (err) throw err;
                        console.log("dept id " + results[0].id)
                        connection.query("DELETE FROM role WHERE ?",
                            { id: results[0].id },

                            function (err, res) {
                                if (err) throw err;

                                console.log(chalk.green("Deleted " + answer.delete + " from the database"));

                                runSearch();

                            })
                    })
            }
            else {
                runSearch();

            }

        })
    })
}
