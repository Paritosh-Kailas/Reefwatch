const { validationResult } = require('express-validator');
const ApiError = require('../utils/apierror');

/**
 * Runs after express-validator chains; returns 422 if validation fails
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    return next(new ApiError(422, messages, errors.array()));
  }
  next();
};

module.exports = validate;
