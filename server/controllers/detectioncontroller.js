const SpeciesDetection = require('../models/speciesdetection');
const ApiError = require('../utils/apierror');

/** GET /api/detection */
const getAllDetections = async (req, res, next) => {
  try {
    const data = await SpeciesDetection.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

/** GET /api/detection/:id */
const getDetectionById = async (req, res, next) => {
  try {
    const doc = await SpeciesDetection.findById(req.params.id).lean();
    if (!doc) return next(new ApiError(404, 'Detection record not found'));
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/** POST /api/detection */
const createDetection = async (req, res, next) => {
  try {
    const doc = await SpeciesDetection.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllDetections, getDetectionById, createDetection };
