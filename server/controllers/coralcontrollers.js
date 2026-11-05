const CoralAnalysis = require('../models/coralanalysis');
const ApiError = require('../utils/apierror');

/** GET /api/coral */
const getAllCoralAnalyses = async (req, res, next) => {
  try {
    const data = await CoralAnalysis.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

/** GET /api/coral/:id */
const getCoralAnalysisById = async (req, res, next) => {
  try {
    const doc = await CoralAnalysis.findById(req.params.id).lean();
    if (!doc) return next(new ApiError(404, 'Coral analysis not found'));
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/** POST /api/coral */
const createCoralAnalysis = async (req, res, next) => {
  try {
    const doc = await CoralAnalysis.create(req.body);
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/coral/:id */
const deleteCoralAnalysis = async (req, res, next) => {
  try {
    const doc = await CoralAnalysis.findByIdAndDelete(req.params.id);
    if (!doc) return next(new ApiError(404, 'Coral analysis not found'));
    res.json({ success: true, message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCoralAnalyses, getCoralAnalysisById, createCoralAnalysis, deleteCoralAnalysis };
