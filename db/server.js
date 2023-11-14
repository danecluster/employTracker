const inquirer = require("inquirer");
const mysql = require("mysql2");
const logo = require("asciiart-logo");
require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "",
    database: "",
  },
  console.log(`Connected to employees_db database.`)
);

function workTime() {
  const logoText = logo({ name: "TEAM * OF * DOOFS \n :p" }).render();
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