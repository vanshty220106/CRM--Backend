const authService = require('../services/authService');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });
};

/**
 * @route   POST /api/auth/firebase-sync
 * @desc    Bridge Firebase Auth users into MongoDB
 * @access  Public
 */
const firebaseSync = async (req, res, next) => {
  try {
    const { uid, email, name, role } = req.body;
    if (!uid || !email) {
      return res.status(400).json({ status: 'fail', message: 'Missing Firebase credentials' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString('hex') + 'A1!';
      
      user = await User.create({
        name: name || 'Citizen',
        email,
        password: randomPassword,
        role: role || 'citizen',
      });
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      data: { user, token },
    });
  } catch (error) {
    next(error);
  }
};

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

module.exports = { register, login, firebaseSync };
