const express = require('express');
const { getProfile, updateProfile, changePassword } = require('../controllers/usercontroller');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

module.exports = router;
