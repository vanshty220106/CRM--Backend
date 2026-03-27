const authService = require('../services/authService');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);

    res.status(201).json({
      status: 'success',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Log in a user
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);

    res.status(200).json({
      status: 'success',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
