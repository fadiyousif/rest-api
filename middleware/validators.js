const employees = require("../data/employees.json");

const validatePayloadFormat = (req, res, next) => {
  const validKeys = ["firstName", "lastName", "email"];
  const keys = Object.keys(req.body);

  const isValidFormat =
    keys.length === validKeys.length &&
    keys.every((key) => validKeys.includes(key));

  if (!isValidFormat) {
    return res.status(400).json({
      error:
        "Invalid payload. Provide an object that strictly contains first name, last name, and email address",
    });
  }

  next();
};

const validateName = (req, res, next) => {
  const { firstName, lastName } = req.body;
  const names = [firstName, lastName];
  const isValidLength = names.every((name) => name.length >= 2);

  if (!isValidLength) {
    return res.status(400).json({
      error:
        "Invalid first or last name. Each name must be at least two characters long.",
    });
  }

  const nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  const isValidName = names.every((name) =>
    [...name].every((char) => !nums.includes(char))
  );

  if (!isValidName) {
    return res.status(400).json({
      error: `Invalid first or last name. Numbers are not allowed.`,
    });
  }

  next();
};

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  const regex = new RegExp(/^\S+@\S+\.\S+$/);
  const isValidEmail = regex.test(email);

  if (!isValidEmail) {
    return res
      .status(400)
      .json({ error: `${email} is invalid. Provide a valid email address.` });
  }

  const isEmailRegistered = employees.some(
    (employee) => employee.email === email
  );

  if (isEmailRegistered) {
    return res.status(403).json({ error: `${email} is already registered` });
  }

  next();
};

const validateId = (req, res, next) => {
  const { id } = req.params;
  const isInteger = Number.isInteger(Number(id));

  if (!isInteger) {
    return res
      .status(400)
      .json({ error: `Invalid input. ID must be an integer.` });
  }

  next();
};

module.exports = {
  validatePayloadFormat,
  validateName,
  validateEmail,
  validateId,
};
