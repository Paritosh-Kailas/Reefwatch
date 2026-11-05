const Species = require('../models/species');
const ApiError = require('../utils/apierror');

/** GET /api/species */
const getAllSpecies = async (req, res, next) => {
  try {
    const { search, conservationStatus } = req.query;
    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (conservationStatus) filter.conservationStatus = conservationStatus;
    const data = await Species.find(filter).sort({ name: 1 }).lean();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

/** GET /api/species/:id */
const getSpeciesById = async (req, res, next) => {
  try {
    const doc = await Species.findById(req.params.id).lean();
    if (!doc) return next(new ApiError(404, 'Species not found'));
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/** POST /api/species */
const createSpecies = async (req, res, next) => {
  try {
    const doc = await Species.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/** PUT /api/species/:id */
const updateSpecies = async (req, res, next) => {
  try {
    const doc = await Species.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return next(new ApiError(404, 'Species not found'));
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/species/:id */
const deleteSpecies = async (req, res, next) => {
  try {
    const doc = await Species.findByIdAndDelete(req.params.id);
    if (!doc) return next(new ApiError(404, 'Species not found'));
    res.json({ success: true, message: 'Species deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSpecies, getSpeciesById, createSpecies, updateSpecies, deleteSpecies };
