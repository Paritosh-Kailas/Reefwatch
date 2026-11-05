const express = require('express');
const { getMapData, getGlobalStats } = require('../controllers/densitycontroller');

const router = express.Router();

router.get('/map', getMapData);
router.get('/stats', getGlobalStats);

module.exports = router;
