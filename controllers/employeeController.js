const Employee = require("../models/EmployeeModel");

// @route GET /api/employees
const getEmployees = (_req, res) => {
  try {
    const employees = Employee.findAll();
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "Could not fetch list of employees" });
  }
};

// @route POST /api/employees
const createEmployee = async (req, res) => {
  const newEmployee = await Employee.create(req.body);
  res.status(201).json(newEmployee);
};

// @route DELETE /api/employees/:id
const deleteEmployee = (req, res) => {
  const { id } = req.params;
  const employee = Employee.findById(id);

  if (employee) {
    Employee.delete(id);
    res.status(200).json({ success: `Employee ${id} has been deleted` });
  } else {
    res.status(404).json({ error: `Employee ${id} not found` });
  }
};

module.exports = { getEmployees, createEmployee, deleteEmployee };
