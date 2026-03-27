const AppError = require('../../utils/AppError');

/**
 * Joi validation middleware factory.
 * Validates req.body against the given schema.
 *
 * @param {import('joi').ObjectSchema} schema - Joi schema to validate against.
 * @returns {Function} Express middleware.
 */
const validate = (schema) => {
  return (req, _res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // Return all errors, not just the first
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const messages = error.details.map((detail) => detail.message).join('; ');
      return next(new AppError(messages, 400));
    }

    next();
  };
};

module.exports = validate;
