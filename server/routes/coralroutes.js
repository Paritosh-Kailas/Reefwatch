const express = require('express');
const { getAllCoralAnalyses, getCoralAnalysisById, createCoralAnalysis, deleteCoralAnalysis } = require('../controllers/coralcontrollers');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

router.get('/', getAllCoralAnalyses);
router.get('/:id', getCoralAnalysisById);
router.post('/', protect, createCoralAnalysis);
router.delete('/:id', protect, deleteCoralAnalysis);

module.exports = router;
