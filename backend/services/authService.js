const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../../utils/AppError');

/**
 * Sign a JWT for the given user ID.
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string, role?: string }} data
 * @returns {{ user: object, token: string }}
 */
const register = async (data) => {
  // Check for existing user
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new AppError('A user with this email already exists.', 400);
  }

  const user = await User.create(data);
  const token = signToken(user._id);

  return { user, token };
};

/**
 * Log in an existing user.
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, token: string }}
 */
const login = async ({ email, password }) => {
  // Find user and explicitly select password field
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('This account has been deactivated. Contact an administrator.', 401);
  }

  const token = signToken(user._id);

  return { user, token };
};

module.exports = { register, login };
