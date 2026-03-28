const jwt = require('jsonwebtoken');
const { User } = require('../utils/dbAdapter');
const AppError = require('../utils/AppError');
const bcrypt = require('bcryptjs');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'civicflow_local_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Register a new user.
 */
const register = async (data) => {
  // Check for existing user
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    throw new AppError('A user with this email already exists.', 400);
  }

  const user = await User.create({
    ...data,
    isActive: true,
  });

  const token = signToken(user._id);
  return { user, token };
};

/**
 * Log in an existing user.
 */
const login = async ({ email, password }) => {
  // Find user — must explicitly ask for password in local db
  let user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Compare password
  let isMatch = false;
  if (typeof user.comparePassword === 'function') {
    // Mongoose doc
    isMatch = await user.comparePassword(password);
  } else {
    // Local doc — password is already hashed
    isMatch = await bcrypt.compare(password, user.password || '');
  }

  if (!isMatch) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (user.isActive === false) {
    throw new AppError('This account has been deactivated. Contact an administrator.', 401);
  }

  const token = signToken(user._id);
  return { user, token };
};

module.exports = { register, login };
