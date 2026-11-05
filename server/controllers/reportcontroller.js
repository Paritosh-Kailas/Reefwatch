const Report = require('../models/report');
const ApiError = require('../utils/apierror');

/** GET /api/reports */
const getAllReports = async (req, res, next) => {
  try {
    const data = await Report.find({ createdBy: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    next(err);
  }
};

/** GET /api/reports/:id */
const getReportById = async (req, res, next) => {
  try {
    const doc = await Report.findById(req.params.id).lean();
    if (!doc) return next(new ApiError(404, 'Report not found'));
    res.json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/** POST /api/reports */
const createReport = async (req, res, next) => {
  try {
    const doc = await Report.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ success: true, data: doc });
  } catch (err) {
    next(err);
  }
};

/** DELETE /api/reports/:id */
const deleteReport = async (req, res, next) => {
  try {
    const doc = await Report.findByIdAndDelete(req.params.id);
    if (!doc) return next(new ApiError(404, 'Report not found'));
    res.json({ success: true, message: 'Report deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllReports, getReportById, createReport, deleteReport };
