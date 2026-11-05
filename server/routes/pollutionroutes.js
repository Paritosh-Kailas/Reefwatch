const express = require('express');
const { getPollutionMap, getGlobalStats, importDataset } = require('../controllers/pollutioncontroller');

const router = express.Router();

router.get('/map', getPollutionMap);
router.get('/stats', getGlobalStats);
router.post('/import', importDataset);

module.exports = router;
