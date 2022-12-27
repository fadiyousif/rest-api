const employees = require("../data/employees.json");
const {
  generateNewId,
  capitalizeName,
  writeDataToFile,
} = require("../utils/utils");

class Employee {
  static path = "./data/employees.json";

  static findAll() {
    return employees;
  }

  static findById(id) {
    return employees.find((employee) => employee.id == id);
  }

  static create({ firstName, lastName, email }) {
    const id = generateNewId(employees);

    const newEmployee = {
      firstName: capitalizeName(firstName),
      lastName: capitalizeName(lastName),
      email,
      id,
    };

    employees.push(newEmployee);
    if (process.env.NODE_ENV !== "test") {
      writeDataToFile(Employee.path, employees);
    }

    return new Promise((resolve) => resolve(newEmployee));
  }

  static async delete(id) {
    const index = employees.findIndex((employee) => employee.id == id);
    employees.splice(index, 1);
    if (process.env.NODE_ENV !== "test") {
      writeDataToFile(Employee.path, employees);
    }
  }
}

module.exports = Employee;
