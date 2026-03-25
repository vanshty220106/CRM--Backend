const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');

/**
 * Protect routes — verifies JWT and attaches user to req.
 */
const auth = async (req, _res, next) => {
  try {
    // 1) Extract token from Authorization header
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(new AppError('The user belonging to this token no longer exists.', 401));
    }

    // 4) Check if user is still active
    if (!currentUser.isActive) {
      return next(new AppError('This user account has been deactivated.', 401));
    }

    // 5) Grant access
    req.user = currentUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
