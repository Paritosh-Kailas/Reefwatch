const express = require('express');
const { getAllReports, getReportById, createReport, deleteReport } = require('../controllers/reportcontroller');
const { protect } = require('../middleware/authmiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllReports);
router.get('/:id', getReportById);
router.post('/', createReport);
router.delete('/:id', deleteReport);

module.exports = router;
