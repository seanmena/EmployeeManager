const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");

const con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "anemluke13",
    database: "empl_db"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected");
});



function promptUser(){
inquirer
  .prompt([
    {
        type: 'list',
        name: 'Choice1',
        message: 'What would you like to do',
        choices: [
            "View all employees",
            "Add an employee",
            "View all roles",
            "Add a role",
            "Update employee role",
            "End Program"

        ]
    }
    
  ])
  .then(answers => {
   switch (answers.Choice1) {
       case "View all employees":
           viewEmployees();
           break;

        case "Add an employee":
            addEmployee();
            break;

        case "View all roles":
            viewRoles();
            break;

        case "Add a role":
            addRole();
            break;

        case "Update employee role":
            updateRole();
            break;

        case "End Program":
            endProgram();
            break;
       }
    })
  .catch(error => {
    if(error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      console.log(error);
    }
});
}

function viewEmployees(){
    con.query("SELECT * FROM employee", function (err, results) {
        if (err) throw err;
        var emplTable = consoleTable.getTable(results);
        console.log(emplTable)
    })
    promptUser();
};


function addEmployee() {
    con.query ("SELECT * FROM role", function (err, roleResults) {
        if (err) throw err;
        console.log(roleResults);
        con.query("SELECT * FROM department", function (err, depResults) {
            if (err) throw err;
            console.log(depResults);

        var string2 = JSON.stringify(roleResults);
        var json2 = JSON.parse(string2);
        console.log(json2[1].title);



     
        
    inquirer
        .prompt([
            {   
                name: "firstname",
                type: "input",
                message: "What is their first name?"
            },
            {
                name: "lastname",
                type: "input",
                message: "What is their last name?"
            },
            {
                name: "emploRole",
                type: "list",
                message: "What is their role?",
                choices: function () {
                    var pickOne = [];
                    roleResults.forEach((holdMe) => {
                        let name = holdMe.title;
                        let value = holdMe.id;
                        pickOne.push({ name, value });
                    })
                    return pickOne;
                }
            }
            
        ])
        .then(answers => {
            con.query("INSERT INTO employee set ?",
                {
                    first_name: answers.firstname,
                    last_name: answers.lastname,
                    role_id: answers.emploRole
                },
            
            function (err, result) {
                if (err) throw err;
                console.log("added");
                promptUser();
            });
        })
    })
})
};
   

function viewRoles() {
    con.query("SELECT * FROM role", function (err, results) {
        if (err) throw err;
        var roleTable = consoleTable.getTable(results);
        console.log(roleTable)
    })
    promptUser();
}
 
function addRole(){
        con.query("SELECT * FROM department", function (err, depResults) {
            if (err) throw err;
            console.log(depResults);

        var string = JSON.stringify(depResults);
        var json = JSON.parse(string);
        console.log(json[1].depname);

    inquirer 
        .prompt([
            {
                name: "roleName",
                type:"input",
                message:"what is your roles name?"
            },
            {
                name: "roleSalary",
                type: "input",
                message: "what is the salary?"
            },
            {
                name: "roleDept",
                type: "list",
                message: "what department?",
                choices: function () {
                    let choiceArray = [];
                    depResults.forEach((holdMe) => {
                        let name = holdMe.depname;
                        let value = holdMe.id;
                        choiceArray.push({ name, value });
                    });
                    return choiceArray;
                }
            }
        ]).then(answers => {
                con.query("INSERT INTO role set ?",
                    {
                        title: answers.roleName,
                        salary: answers.roleSalary,
                        department_id: answers.roleDept
                    },
                
                function (err, result) {
                    if (err) throw err;
                    console.log("added");
                    promptUser();
                });
            })
        })
    }

function updateRole(){
        con.query("SELECT * FROM employee", function(err, employresults) {
            if (err) throw err;
            var string = JSON.stringify(employresults);
            var json = JSON.parse(string);
            console.log(json[1].first_name);
            inquirer.prompt(
                {
                    name: "upEmploy",
                    type: "list",
                    message: "which employee do you want to update?",
                    choices: function () {
                        let choiceArray = [];
                        employresults.forEach((holdMe) => {
                            let name = ""
                            name = (holdMe.first_name + " " + holdMe.last_name);
                            let value = holdMe.id;
                            choiceArray.push({ name, value });
                        });
                        return choiceArray;
                    }
                }
            ).then(function(answer) {
                con.query("SELECT * FROM role", function(err, roResults) {
                    if (err) throw err;
                    var string = JSON.stringify(roResults);
                    var json = JSON.parse(string);
                    console.log(json[1].title);
                    inquirer.prompt(
                        {
                            name: "upRole",
                            type: "list",
                            message: "what is their new role?",
                            choices: function() {
                                let choiceArray = [];
                                roResults.forEach((holdMe) => {
                                    let name = (holdMe.title);
                                    let value = holdMe.id;
                                    choiceArray.push({ name, value });
                                });
                                return choiceArray;
                            }
                        }
                    ).then(function(roleAnswer) {
                        con.query("UPDATE employee SET ? WHERE ?", [
                            {
                                role_id: roleAnswer.upRole
                            },
                            {
                                id: answer.upEmploy
                            }
                        ])
                        console.log("updated")
                        promptUser();
                    })
                })
            });
        })
    }
function endProgram(){
    con.end();
}






promptUser();
