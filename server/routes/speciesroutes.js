const express = require('express');
const { getAllSpecies, getSpeciesById, createSpecies, updateSpecies, deleteSpecies } = require('../controllers/speciescontroller');
const { protect, restrictTo } = require('../middleware/authmiddleware');

const router = express.Router();

router.get('/', getAllSpecies);
router.get('/:id', getSpeciesById);
router.post('/', protect, createSpecies);
router.put('/:id', protect, updateSpecies);
router.delete('/:id', protect, restrictTo('admin'), deleteSpecies);

module.exports = router;
