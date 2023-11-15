const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo");
require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to employees_db database.`)
);

function wocka() {
  const logoText = logo({ name: "Wocka \n :p" }).render();
  console.log(logoText);
  inquirer
    .prompt([
      {
        type: "list",
        name: "openingMessage",
        message: "What would you like to do?",
        choices: [
          "viewAllEmployees",
          "viewAllDepartments",
          "viewAllRoles",
          "addADepartment",
          "addARole",
          "addAEmployee",
          "updateEmployee",          
          "quit",
        ],
      },
    ])
    .then((inquirerResponse) => {
      console.log("user selected:    " + inquirerResponse.openingMessage);
      let choices = inquirerResponse.openingMessage;
      switch (choices) {
        case "viewAllEmployees":
          viewAllEmployees();
          break;
        case "viewAllDepartments":
          viewAllDepartments();
          break;
        case "viewAllRoles":
          viewAllRoles();
          break;
        case "addADepartment":
          addADepartment();
          break;
        case "addARole":
          addARole();
          break;
        case "addAEmployee":
          addAEmployee();
          break;
        case "updateEmployee":
          updateEmployee();
          break;       
        case "quit":
          quit();
          break;
        default:
          console.log("somethings wrong with you");
          break;
      }
    });
}

function viewAllEmployees(){
  db.query("select * from employee", function(err, res){
    err?console.log(err): console.table(res), wocka()
  })
}

function viewAllRoles(){
  db.query("select * from role", function(err, res){
    err?console.log(err): console.table(res), wocka()
  })
}

function viewAllDepartments(){
  db.query("select * from department", function(err, res){
    err?console.log(err): console.table(res), wocka()
  })
}

function addADepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addADepartment",
        message: "enter a department.",
      },
    ])
    .then((inquirerResponse) => {
      console.log("department added:  " + inquirerResponse.addADepartment);
      let departmentName = inquirerResponse.addADepartment;
      db.query(
        `INSERT INTO
                department 
                (name) VALUES 
                ('${departmentName}')`,
        function (err, results) {
          err
            ? console.log(err)
            : console.table(`Added ${departmentName}!!!!`, results),
            wocka();
        }
      );
    });
}

function addARole() {
  db.query("SELECT * FROM department", function (err, results) {
    if (err) {
      console.log(err);
      return wocka();
    }
    const departmentChoices = results.map((department) => ({
      value: department.id,
      name: department.dept_name,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "addARole",
          message: "Enter a role.",
        },
        {
          type: "input",
          name: "salary",
          message: "salary",
        },
        {
          type: "list",
          name: "deptId",
          message: "witch department does this belong to?",
          choices: departmentChoices,
        },
      ])
      .then((inquirerResponse) => {
        console.log("Role added:  " + inquirerResponse.addARole);
        let departmentId = inquirerResponse.deptId;
        let roleName = inquirerResponse.addARole;
        let roleSalary = inquirerResponse.salary;
        db.query(
          `INSERT INTO 
                 role
                 (title, salary, department_id) 
                 VALUES 
                 ('${roleName}', 
                '${roleSalary}',
                '${departmentId}')`,
          function (err, results) {
            err
              ? console.log(err)
              : console.table(`Added:  ${roleName}!!!!`, results),
              wocka();
          }
        );
      });
  });
}

function addAEmployee() {
  db.query("SELECT * FROM role", function (err, results) {
    if (err) {
      console.log(err);
      return wocka();
    }

    const roleChoices = results.map((role) => ({
      value: role.id,
      name: role.title,
    }));
    db.query("SELECT * FROM employee_list", function (err, employeeResults) {
      if (err) {
        console.log(err);
        return wocka();
      }

      const managerChoices = employeeResults.map((employee) => ({
        value: employee.id,
        name: `${employee.first_name} ${employee.last_name}`,
      }));

      // Add an option for no manager
      managerChoices.push({ value: null, name: "No Manager" });
    ///inquirer
    inquirer
      .prompt([
        {
          type: "input",
          name: "firstName",
          message: "Enter an employee name.",
        },
        {
          type: "input",
          name: "lastName",
          message: "enter an employee last name.",
        },
        {
          type: "list",
          name: "roleId",
          message: "wich role are we adding this person to.",
          choices: roleChoices,
        },
        {
          type: "list",
          name: "managerId",
          message: "Select the employee's manager (or 'No Manager'):",
          choices: managerChoices,
        },
      ])
      .then((inquirerResponse) => {
        console.log("employee added: " + inquirerResponse.roleId);
        const roleId = inquirerResponse.roleId;
        const empName = inquirerResponse.firstName;
        const empLast = inquirerResponse.lastName;
        const managerId = inquirerResponse.managerId;
        db.query(
          `INSERT INTO employee 
               (first_name, last_name, 
                role_id, manager_id) VALUES 
                ('${empName}', 
                '${empLast}', 
                '${roleId}',
                '${managerId}')`,
          function (err, results) {
            err
              ? console.log(err)
              : console.table(`Added:  ${empName}!!!!`, results),
              wocka();
          }
        );
      });
  });
});
}

function updateEmployee() {
  // Display a prompt to get the employee's ID and the new role ID
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeId",
        message: "Enter the ID of the employee you want to update:",
      },
      {
        type: "list",
        name: "roleId",
        message: "Select the new role for the employee:",
        choices: roleChoices,
      },
    ])
    .then((inquirerResponse) => {
      const { employeeId, roleId } = inquirerResponse;

      // Update the employee in the database
      db.query(
        `UPDATE employee 
                SET role_id = ? 
                WHERE id = ?`,
        [roleId, employeeId],
        function (err, results) {
          if (err) {
            console.log(err);
          } else {
            console.log(
              `Employee with ID ${employeeId} has been updated with the new role ID ${roleId}.`
            );
          }
          wocka();
        }
      );
    });
}

wocka();