const { writeFile } = require("fs");

const generateNewId = (employees) => {
  const newId =
    employees.length > 0
      ? Number(employees[employees.length - 1]["id"]) + 1
      : 1;
  return newId.toString();
};

const capitalizeName = (name) => name[0].toUpperCase() + name.slice(1);

const writeDataToFile = (path, employee) => {
  return new Promise((resolve, reject) => {
    writeFile(path, JSON.stringify(employee), (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(employee);
      }
    });
  });
};

module.exports = {
  generateNewId,
  capitalizeName,
  writeDataToFile,
};
