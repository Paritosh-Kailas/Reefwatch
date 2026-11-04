const express = require('express');
const { getPollutionMap, importDataset } = require('../controllers/pollutioncontroller');

const router = express.Router();

router.get('/map', getPollutionMap);
router.post('/import', importDataset);

module.exports = router;