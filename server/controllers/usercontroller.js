const User = require('../models/user');
const ApiError = require('../utils/apierror');

/** GET /api/users/profile */
const getProfile = async (req, res, next) => {
  try {
    res.json({ success: true, data: req.user });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/users/profile */
const updateProfile = async (req, res, next) => {
  try {
    const { name, organization, avatarUrl } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, organization, avatarUrl },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/users/change-password */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return next(new ApiError(401, 'Current password is incorrect'));
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword };
