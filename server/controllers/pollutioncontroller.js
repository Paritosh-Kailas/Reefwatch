const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const PollutionAnalysis = require('../models/pollutionanalysis');

const CELL = 2; // degrees: nearby readings are grouped into one hotspot

// NOAA concentration classes -> 0-100 score ("very" must be checked first)
const CLASS_SCORES = [['very high', 95], ['very low', 10], ['high', 80], ['medium', 55], ['low', 30]];
const scoreFromClass = (text) => {
  const t = String(text || '').toLowerCase();
  const hit = CLASS_SCORES.find(([k]) => t.includes(k));
  return hit ? hit[1] : null;
};
const severityFromScore = (s) => (s >= 80 ? 'Critical' : s >= 50 ? 'Moderate' : s >= 25 ? 'Low' : 'Pristine');
const pick = (row, name) => {
  const key = Object.keys(row).find((k) => k.trim().toLowerCase() === name);
  return key ? row[key] : undefined;
};

const sevScore = {
  $switch: {
    branches: [
      { case: { $eq: ['$pollutionSeverity', 'Critical'] }, then: 100 },
      { case: { $eq: ['$pollutionSeverity', 'Moderate'] }, then: 66 },
      { case: { $eq: ['$pollutionSeverity', 'Low'] }, then: 33 },
    ],
    default: 0,
  },
};
const snap = (f) => ({ $multiply: [{ $floor: { $divide: [f, CELL] } }, CELL] });

// GET /api/pollution/map?reefBelt=true
exports.getPollutionMap = async (req, res, next) => {
  try {
    const match = { 'location.coordinates.1': { $exists: true } };
    if (req.query.reefBelt === 'true') match['location.coordinates.1'] = { $gte: -32, $lte: 32 };

    const hotspots = await PollutionAnalysis.aggregate([
      { $match: match },
      {
        $addFields: {
          lng: { $arrayElemAt: ['$location.coordinates', 0] },
          lat: { $arrayElemAt: ['$location.coordinates', 1] },
          base: {
            $ifNull: [
              '$pollutionScore',
              {
                $cond: [
                  { $in: [{ $type: '$waterClarityIndex' }, ['missing', 'null']] },
                  sevScore,
                  { $add: [{ $multiply: [sevScore, 0.6] }, { $multiply: [{ $subtract: [100, '$waterClarityIndex'] }, 0.4] }] },
                ],
              },
            ],
          },
        },
      },
      {
        $group: {
          _id: { lat: snap('$lat'), lng: snap('$lng') },
          score: { $avg: '$base' },
          count: { $sum: 1 },
          scans: { $sum: { $cond: [{ $eq: ['$source', 'dataset'] }, 0, 1] } },
        },
      },
      {
        $project: {
          _id: 0,
          lat: { $add: ['$_id.lat', CELL / 2] },
          lng: { $add: ['$_id.lng', CELL / 2] },
          score: { $round: ['$score', 0] },
          count: 1,
          scans: 1,
        },
      },
      { $sort: { score: -1 } },
      { $limit: 1500 },
    ]);

    const data = hotspots.map((h, i) => ({ id: `h${i}`, ...h }));
    res.json({ hotspots: data, totalReadings: data.reduce((s, h) => s + h.count, 0) });
  } catch (err) {
    next(err);
  }
};

// POST /api/pollution/import   (header: x-import-key = IMPORT_KEY from .env)
// Reads backend/uploads/microplastics.csv and stores it as dataset rows.
exports.importDataset = async (req, res, next) => {
  try {
    if (!process.env.IMPORT_KEY || req.get('x-import-key') !== process.env.IMPORT_KEY) {
      return res.status(403).json({ message: 'Invalid import key' });
    }
    const file = path.join(__dirname, '..', 'uploads', 'microplastics.csv');
    if (!fs.existsSync(file)) {
      return res.status(404).json({ message: 'Put microplastics.csv in backend/uploads/ first' });
    }
    const rows = parse(fs.readFileSync(file), { columns: true, skip_empty_lines: true, relax_column_count: true, bom: true });

    const docs = [];
    for (const row of rows) {
      const lat = parseFloat(pick(row, 'latitude') ?? pick(row, 'lat'));
      const lng = parseFloat(pick(row, 'longitude') ?? pick(row, 'lon') ?? pick(row, 'lng'));
      const score = ['concentration class text', 'concentration class range']
        .map((n) => scoreFromClass(pick(row, n)))
        .find((s) => s !== null) ?? null;
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || score === null) continue;
      docs.push({
        source: 'dataset',
        pollutionScore: score,
        pollutionSeverity: severityFromScore(score),
        location: { type: 'Point', coordinates: [lng, lat] },
      });
    }

    await PollutionAnalysis.deleteMany({ source: 'dataset' });
    for (let i = 0; i < docs.length; i += 1000) {
      await PollutionAnalysis.insertMany(docs.slice(i, i + 1000), { ordered: false });
    }
    res.json({ imported: docs.length, skipped: rows.length - docs.length, columnsFound: Object.keys(rows[0] || {}) });
  } catch (err) {
    next(err);
  }
};