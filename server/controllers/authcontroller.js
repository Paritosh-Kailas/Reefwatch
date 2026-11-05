const User = require('../models/user');
const generateToken = require('../utils/generatetoken');
const ApiError = require('../utils/apierror');

/** POST /api/auth/register */
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, organization } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return next(new ApiError(409, 'Email already registered'));

    const user = await User.create({ name, email, password, role, organization });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

/** POST /api/auth/login */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new ApiError(401, 'Invalid email or password'));
    }
    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    next(err);
  }
};

/** GET /api/auth/me */
const getMe = async (req, res, next) => {
  try {
    res.json({ success: true, user: req.user });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
