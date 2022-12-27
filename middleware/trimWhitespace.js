const trimWhitespace = ({ body }, _res, next) => {
  for (const key in body) {
    body[key] = body[key].trim();
  }

  next();
};

module.exports = trimWhitespace;
