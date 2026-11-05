const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ApiError = require('../utils/apierror');

/**
 * Protect routes — requires a valid Bearer JWT in Authorization header
 */
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new ApiError(401, 'Not authorized — no token provided'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return next(new ApiError(401, 'User no longer exists'));
    }
    next();
  } catch (error) {
    next(new ApiError(401, 'Not authorized — invalid token'));
  }
};

/**
 * Restrict access to specific roles
 * @param  {...string} roles
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to perform this action'));
    }
    next();
  };
};

module.exports = { protect, restrictTo };
