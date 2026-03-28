const { User } = require('../utils/dbAdapter');
const authService = require('../services/authService');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'civicflow_local_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '90d',
  });

/**
 * POST /api/auth/firebase-sync
 * Bridge Firebase Auth users into the DB (Atlas or local).
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
        isActive: true,
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
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ status: 'success', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.status(200).json({ status: 'success', data: { user, token } });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, firebaseSync };
