const express = require("express");
const trimWhitespace = require("../middleware/trimWhitespace");
const {
  getEmployees,
  createEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const {
  validateName,
  validateEmail,
  validatePayloadFormat,
  validateId,
} = require("../middleware/validators");

const router = express.Router();

router
  .route("/")
  .get(getEmployees)
  .post(
    trimWhitespace,
    validatePayloadFormat,
    validateEmail,
    validateName,
    createEmployee
  );

router.delete("/:id", validateId, deleteEmployee);

module.exports = router;
