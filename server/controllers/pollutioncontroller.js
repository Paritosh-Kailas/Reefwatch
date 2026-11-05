/**
 * Pollution Controller
 *
 * The map is backed by the bundled NOAA NCEI marine microplastics CSV.
 * This is an archived field-observation dataset, not a live sensor feed.
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const CSV_PATH = path.join(__dirname, '..', 'uploads', 'microplastics.csv');
const SOURCE_NAME = 'NOAA NCEI marine microplastics dataset';
const SOURCE_URL = 'https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ncei%3AMicroplasticsDatabase';

const CLASS_SCORE = {
  'very low': 15,
  low: 35,
  medium: 60,
  high: 80,
  'very high': 95,
};

let cachedSamples = null;

function readSamples() {
  if (cachedSamples) return cachedSamples;
  if (!fs.existsSync(CSV_PATH)) {
    throw new Error(`Microplastics CSV not found: ${CSV_PATH}`);
  }

  const csv = fs.readFileSync(CSV_PATH, 'utf8');
  const rows = parse(csv, {
    columns: true,
    bom: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  });

  cachedSamples = rows.map((row) => {
    const latRaw = String(row['Latitude (degree)'] || '').trim();
    const lngRaw = String(row['Longitude (degree)'] || '').trim();
    const concentrationRaw = String(row['Microplastics Measurement'] || '').trim();
    const lat = latRaw ? Number(latRaw) : NaN;
    const lng = lngRaw ? Number(lngRaw) : NaN;
    const concentration = concentrationRaw ? Number(concentrationRaw) : null;
    const concentrationClass = String(row['Concentration Class'] || '').trim();
    const unit = String(row.Unit || '').trim();

    return {
      id: row['Unique ID'],
      date: row['Sample Date'] || null,
      lat,
      lng,
      country: row.Country || '',
      ocean: row.Ocean || '',
      region: row.Region || '',
      beach: row['Beach Location'] || row.Subregion || row.Region || row.Country || 'Unspecified site',
      marineSetting: row['Marine Setting'] || 'Unspecified setting',
      samplingMethod: row['Sampling Method'] || 'Unspecified method',
      concentration: Number.isFinite(concentration) ? concentration : null,
      unit,
      concentrationClass,
      score: CLASS_SCORE[concentrationClass.toLowerCase()] ?? 50,
      reference: row.DOI || row['Long Reference'] || row['Short Reference'] || '',
      accessionUrl: row['NCEI Accession Link'] || '',
    };
  }).filter((row) =>
    Number.isFinite(row.lat) &&
    Number.isFinite(row.lng) &&
    row.lat >= -90 && row.lat <= 90 &&
    row.lng >= -180 && row.lng <= 180 &&
    row.concentration !== null &&
    row.unit
  );

  return cachedSamples;
}

function buildHotspots(samples) {
  const groups = new Map();

  for (const sample of samples) {
    // Keep units separate: pieces/m3 must never be averaged with pieces/kg.
    const key = [
      sample.country,
      sample.beach,
      sample.lat.toFixed(3),
      sample.lng.toFixed(3),
      sample.marineSetting,
      sample.samplingMethod,
      sample.unit,
    ].join('|');

    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        name: sample.beach,
        location: sample.country,
        lat: sample.lat,
        lng: sample.lng,
        ocean: sample.ocean,
        marineSetting: sample.marineSetting,
        samplingMethod: sample.samplingMethod,
        unit: sample.unit,
        count: 0,
        concentrationTotal: 0,
        concentrationCount: 0,
        classCounts: {},
        dates: [],
        references: new Set(),
        accessionUrl: sample.accessionUrl,
      });
    }

    const group = groups.get(key);
    group.count += 1;
    if (sample.concentration !== null) {
      group.concentrationTotal += sample.concentration;
      group.concentrationCount += 1;
    }
    if (sample.concentrationClass) {
      group.classCounts[sample.concentrationClass] =
        (group.classCounts[sample.concentrationClass] || 0) + 1;
    }
    if (sample.date) group.dates.push(sample.date);
    if (sample.reference) group.references.add(sample.reference);
    if (!group.accessionUrl && sample.accessionUrl) group.accessionUrl = sample.accessionUrl;
  }

  return Array.from(groups.values()).map((group, index) => {
    const concentrationClass = Object.entries(group.classCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unclassified';
    const dates = group.dates.map((value) => new Date(value)).filter((date) => !Number.isNaN(date.valueOf())).sort((a, b) => a - b);

    return {
      id: `ncei-${index}-${Buffer.from(group.id).toString('base64').slice(0, 12)}`,
      name: group.name,
      location: group.location,
      lat: group.lat,
      lng: group.lng,
      ocean: group.ocean,
      marineSetting: group.marineSetting,
      samplingMethod: group.samplingMethod,
      score: CLASS_SCORE[concentrationClass.toLowerCase()] ?? 50,
      count: group.count,
      avgConcentration: group.concentrationCount
        ? Number((group.concentrationTotal / group.concentrationCount).toFixed(3))
        : null,
      unit: group.unit,
      concentrationClass,
      sampleDateStart: dates[0]?.toISOString().slice(0, 10) || null,
      sampleDateEnd: dates[dates.length - 1]?.toISOString().slice(0, 10) || null,
      references: Array.from(group.references).slice(0, 3),
      accessionUrl: group.accessionUrl,
      source: SOURCE_NAME,
    };
  });
}

/** GET /api/pollution/map */
const getPollutionMap = async (req, res) => {
  try {
    const samples = readSamples();
    const hotspots = buildHotspots(samples);
    res.json({
      success: true,
      source: SOURCE_NAME,
      sourceUrl: SOURCE_URL,
      dataType: 'archived_field_observations',
      isLive: false,
      totalReadings: samples.length,
      hotspots,
    });
  } catch (error) {
    console.error('[Pollution] Could not read microplastics CSV:', error);
    res.status(500).json({
      success: false,
      message: 'Could not load the bundled microplastics dataset',
    });
  }
};

/** GET /api/pollution/stats */
const getGlobalStats = async (req, res) => {
  try {
    const samples = readSamples();
    const hotspots = buildHotspots(samples);
    const averageScore = hotspots.length
      ? Math.round(hotspots.reduce((sum, item) => sum + item.score, 0) / hotspots.length)
      : 0;

    res.json({
      success: true,
      source: SOURCE_NAME,
      isLive: false,
      data: {
        totalReadings: samples.length,
        totalSites: hotspots.length,
        averageConcentrationClassScore: averageScore,
        units: Array.from(new Set(samples.map((sample) => sample.unit))),
      },
    });
  } catch (error) {
    console.error('[Pollution] Could not calculate dataset stats:', error);
    res.status(500).json({ success: false, message: 'Could not load microplastics statistics' });
  }
};

/** POST /api/pollution/import
 * The CSV is bundled with the server and read directly. This endpoint is
 * intentionally not an upload/import stub; dataset ingestion is automatic.
 */
const importDataset = async (req, res) => {
  try {
    cachedSamples = null;
    const samples = readSamples();
    res.json({
      success: true,
      message: 'Bundled microplastics CSV reloaded',
      importedReadings: samples.length,
    });
  } catch (error) {
    console.error('[Pollution] Dataset reload failed:', error);
    res.status(500).json({ success: false, message: 'Could not reload microplastics CSV' });
  }
};

module.exports = { getPollutionMap, getGlobalStats, importDataset };
