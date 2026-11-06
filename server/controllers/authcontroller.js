const User = require('../models/user');
const generateToken = require('../utils/generatetoken');
const ApiError = require('../utils/apierror');

/** Return only public user fields; never expose password hashes. */
const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

/** POST /api/auth/register */
const register = async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    const organization = typeof req.body.organization === 'string' ? req.body.organization.trim() : '';

    if (!name || !email || !password) {
      return next(new ApiError(400, 'Name, email and password are required'));
    }
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) {
      return next(new ApiError(400, 'Please provide a valid email address'));
    }
    if (password.length < 8) {
      return next(new ApiError(400, 'Password must contain at least 8 characters'));
    }
    if (name.length > 60 || organization.length > 100) {
      return next(new ApiError(400, 'Name or organization is too long'));
    }

    const existing = await User.findOne({ email });
    if (existing) return next(new ApiError(409, 'Email already registered'));

    // Public registration must never allow a client to self-assign admin privileges.
    const user = await User.create({ name, email, password, organization, role: 'researcher' });
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, user: publicUser(user) });
  } catch (err) {
    if (err.code === 11000) return next(new ApiError(409, 'Email already registered'));
    if (err.name === 'ValidationError') return next(new ApiError(400, err.message));
    next(err);
  }
};

/** POST /api/auth/login */
const login = async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!email || !password) {
      return next(new ApiError(400, 'Email and password are required'));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }

    const token = generateToken(user._id);
    res.json({ success: true, token, user: publicUser(user) });
  } catch (err) {
    next(err);
  }
};

/** GET /api/auth/me */
const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: publicUser(req.user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
