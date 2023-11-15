import fs from "fs";
import readlineSync from "readline-sync";

//json file path and log error file path
const dataFilePath = "employeeData.json";
const errorLogFilePath = "error.txt";

//load existing employee data file
function loadData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.log(`something went wrong ${error.message}`);
    logError(error);
  }
}

//save employee data
function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 4));
}

//error messages to log to error file
function logError(error) {
  const logMessage = `${new Date().toISOString()} - ${error.message}\n`;
  fs.appendFileSync(errorLogFilePath, logMessage);
}

//to create a new employee
function createEmployee() {
  try {
    const name = readlineSync.question("Enter employee name: ");
    const dob = readlineSync.question("Enter date of birth (YYYY-MM-DD): ");
    const department = readlineSync.question("Enter department: ");
    const data = loadData();
    //to check if the employee with same name exist
    if (data.some((employee) => employee.name === name)) {
      console.log("Employee with the same name already exists.");
    } else {
      const id = Date.now().toString();
      const newEmployee = { id, name, dob, department };
      data.push(newEmployee);
      saveData(data);
      console.log("Employee created successfully!");
    }
    displayOptions();
    performOperation();
  } catch (error) {
    console.log(`failed to create employee data! ${error.message}`);
    logError(error);
  }
}

//update employee details by overwriting old values
function updateEmployee() {
  try {
    const idToUpdate = readlineSync.question("Enter employee id to update: "); // Get employee id to update
    const data = loadData();
    const employeeToUpdate = data.find((emp) => emp.id === idToUpdate);

    if (employeeToUpdate) {
      const newName = readlineSync.question(
        `Enter new name for ${employeeToUpdate.name}: `
      );
      const newDob = readlineSync.question(
        `Enter new date of birth for ${employeeToUpdate.name} (YYYY-MM-DD): `
      );
      const newDepartment = readlineSync.question(
        `Enter new department for ${employeeToUpdate.name}: `
      );

      // Update the employee's properties
      employeeToUpdate.name = newName;
      employeeToUpdate.dob = newDob;
      employeeToUpdate.department = newDepartment;

      saveData(data); // Save the updated data to the file
      console.log("Employee updated successfully!");
    } else {
      console.log("Employee not found with the specified ID.");
    }

    displayOptions();
    performOperation();
  } catch (error) {
    console.log(`failed to update employee data! ${error.message}`);
    logError(error);
  }
}

//function to delete employee by id
function deleteEmployee() {
  try {
    const idToDelete = readlineSync.question("Enter employee id to delete: "); // Get employee id to delete
    const data = loadData();
    const indexToDelete = data.findIndex((emp) => emp.id === idToDelete);

    if (indexToDelete !== -1) {
      const deletedEmployee = data.splice(indexToDelete, 1)[0]; // Remove the employee from the array
      saveData(data); // Save the updated data to the file
      console.log(`Employee ${deletedEmployee.name} deleted successfully!`);
    } else {
      console.log("Employee not found with the specified ID.");
    }

    displayOptions();
    performOperation();
  } catch (error) {
    console.log(`failed to update employee data! ${error.message}`);
    logError(error);
  }
}

//display employees belonging to same department
function displayByDepartment() {
  try {
    const department = readlineSync.question("Enter department to display: ");
    const data = loadData();
    const departmentEmployees = data.filter(
      (employee) => employee.department === department
    );

    if (departmentEmployees.length === 0) {
      console.log("No employees found in the specified department.");
    } else {
      console.log(`Employees in ${department}:`);
      departmentEmployees.forEach((employee) => {
        console.log(
          `Name: ${employee.name}, Age: ${calculateAge(employee.dob)}`
        );
      });
      console.log(`Total count: ${departmentEmployees.length}`);
    }

    displayOptions();
    performOperation();
  } catch (error) {
    console.log(`Failed to display employee information ${error.message}`);
    logError(error);
  }
}

//display employee by entering ID
function displayById() {
  try {
    const id = readlineSync.question("Enter employee id: ");
    const data = loadData();
    const employee = data.find((emp) => emp.id === id);

    if (employee) {
      console.log(`Employee Details:
        ID: ${employee.id}
        Name: ${employee.name}
        Age: ${calculateAge(employee.dob)}
        Department: ${employee.department}`);
    } else {
      console.log("Employee not found with the specified ID.");
    }

    displayOptions();
    performOperation();
  } catch (error) {
    console.log(`Failed to display employee information ${error.message}`);
    logError(error);
  }
}

function calculateAge(dob) {
  const birthDate = dob.split("-")[0];
  console.log(birthDate);
  const currentDate = new Date().getFullYear();
  console.log(currentDate);
  return Math.floor(currentDate - birthDate);
}

//display options
function displayOptions() {
  console.log("1. Create new employee");
  console.log("2. Update employee record");
  console.log("3. Delete employee");
  console.log("4. Display employees by department");
  console.log("5. Display employee by employee id");
  console.log("6. Exit");
}
//choose operation to perform
function performOperation() {
  const option = readlineSync.question("Choose an option (1-6): ");
  switch (option) {
    case "1":
      createEmployee();
      break;
    case "2":
      updateEmployee();
      break;
    case "3":
      deleteEmployee();
      break;
    case "4":
      displayByDepartment();
      break;
    case "5":
      displayById();
      break;
    case "6":
      console.log("Your session duration is 20 minutes.");
      const sessionEndTime = new Date().getMinutes(); //to take time of exit
      const sessionDuration = Math.floor(sessionEndTime - sessionStartTime);
      console.log(`Session duration: ${sessionDuration} minutes.`);
      break;
    default:
      console.log("Invalid option. Please choose a valid option (1-6).");
      displayOptions();
      performOperation();
  }
}

console.log("Welcome to the Employee Registration Portal");
displayOptions();

//takes the start time of session
const sessionStartTime = new Date().getMinutes();

performOperation();
