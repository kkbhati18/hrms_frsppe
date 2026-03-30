const { validationResult } = require("express-validator");
const { sendError } = require("../utils/apiResponse");

/**
 * Run after express-validator rules to collect and return errors.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, "Validation failed", 422, errors.array());
  }
  next();
};

module.exports = { validate };
