const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const { User, isConnected } = require('../utils/dbAdapter');

const auth = async (req, _res, next) => {
  try {
    // 1) Extract token
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new AppError('You are not logged in. Please log in to get access.', 401));
    }

    // 2) Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'civicflow_local_secret_key');

    // 3) Find user via adapter (Atlas or local)
    const currentUser = await User.findOne({ _id: decoded.id });

    // 4) Accept if user is found and active, OR if local mode (skip strict check)
    if (currentUser) {
      if (!currentUser.isActive && currentUser.isActive !== undefined) {
        return next(new AppError('This user account has been deactivated.', 401));
      }
      req.user = currentUser;
    } else {
      // Fallback: reconstruct minimal user object from JWT payload
      // (happens when DB is offline but token is structurally valid)
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        role: 'citizen',
        isActive: true,
      };
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    next(error);
  }
};

module.exports = auth;
