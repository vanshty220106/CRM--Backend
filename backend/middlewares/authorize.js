const AppError = require('../utils/AppError');

/**
 * Role-based authorization middleware factory.
 * Usage: authorize('admin', 'manager')
 *
 * @param  {...string} roles - Allowed roles.
 * @returns {Function} Express middleware.
 */
const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

module.exports = authorize;
