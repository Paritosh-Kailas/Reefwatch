/**
 * CSV-backed marine microplastics map.
 *
 * Source: NOAA NCEI Marine Microplastics Database (archived observations).
 * These are historical field samples, not live sensor readings.
 */
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const CSV_PATH = path.join(__dirname, '..', 'uploads', 'microplastics.csv');
const SOURCE_NAME = 'NOAA NCEI marine microplastics dataset';
const SOURCE_URL = 'https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ncei%3AMicroplasticsDatabase';
const CLASS_SCORE = { 'very low': 15, low: 35, medium: 60, high: 80, 'very high': 95 };
let cachedSamples = null;

function readSamples() {
  if (cachedSamples) return cachedSamples;
  if (!fs.existsSync(CSV_PATH)) throw new Error(`Microplastics CSV not found: ${CSV_PATH}`);

  const rows = parse(fs.readFileSync(CSV_PATH, 'utf8'), {
    columns: true, bom: true, skip_empty_lines: true, trim: true,
    relax_column_count: true,
  });

  // Keep every record that has usable coordinates and either a numeric
  // measurement or a source-provided concentration class. A missing numeric
  // measurement should not erase an otherwise geolocated observation.
  cachedSamples = rows.map((row, index) => {
    const lat = Number(String(row['Latitude (degree)'] ?? '').trim());
    const lng = Number(String(row['Longitude (degree)'] ?? '').trim());
    const rawMeasurement = String(row['Microplastics Measurement'] ?? '').trim();
    const parsedMeasurement = rawMeasurement === '' ? NaN : Number(rawMeasurement);
    const concentrationClass = String(row['Concentration Class'] ?? '').trim();
    const unit = String(row.Unit ?? '').trim();

    return {
      id: String(row['Unique ID'] || index + 1),
      date: row['Sample Date'] || null,
      lat, lng,
      country: String(row.Country || ''),
      ocean: String(row.Ocean || ''),
      region: String(row.Region || ''),
      beach: String(row['Beach Location'] || row.Subregion || row.Region || row.Country || 'Unspecified site'),
      marineSetting: String(row['Marine Setting'] || 'Unspecified setting'),
      samplingMethod: String(row['Sampling Method'] || 'Unspecified method'),
      concentration: Number.isFinite(parsedMeasurement) ? parsedMeasurement : null,
      unit,
      concentrationClass,
      reference: String(row.DOI || row['Long Reference'] || row['Short Reference'] || ''),
      accessionUrl: String(row['NCEI Accession Link'] || ''),
    };
  }).filter((sample) =>
    Number.isFinite(sample.lat) && sample.lat >= -90 && sample.lat <= 90 &&
    Number.isFinite(sample.lng) && sample.lng >= -180 && sample.lng <= 180 &&
    (sample.concentration !== null || sample.concentrationClass.length > 0)
  );

  return cachedSamples;
}

function buildHotspots(samples) {
  const groups = new Map();
  for (const sample of samples) {
    // Never combine incomparable units, sampling methods, or marine settings.
    const key = [
      sample.country, sample.beach, sample.lat.toFixed(3), sample.lng.toFixed(3),
      sample.marineSetting, sample.samplingMethod, sample.unit || 'no-unit',
    ].join('|');

    if (!groups.has(key)) {
      groups.set(key, {
        key, name: sample.beach, location: sample.country, lat: sample.lat, lng: sample.lng,
        ocean: sample.ocean, marineSetting: sample.marineSetting,
        samplingMethod: sample.samplingMethod, unit: sample.unit,
        count: 0, concentrationTotal: 0, concentrationCount: 0,
        classCounts: {}, dates: [], references: new Set(), accessionUrl: sample.accessionUrl,
      });
    }
    const group = groups.get(key);
    group.count += 1;
    if (sample.concentration !== null) {
      group.concentrationTotal += sample.concentration;
      group.concentrationCount += 1;
    }
    if (sample.concentrationClass) {
      group.classCounts[sample.concentrationClass] = (group.classCounts[sample.concentrationClass] || 0) + 1;
    }
    if (sample.date) group.dates.push(sample.date);
    if (sample.reference) group.references.add(sample.reference);
    if (!group.accessionUrl && sample.accessionUrl) group.accessionUrl = sample.accessionUrl;
  }

  return Array.from(groups.values()).map((group, index) => {
    const concentrationClass = Object.entries(group.classCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Unclassified';
    const dates = group.dates.map((value) => new Date(value))
      .filter((date) => !Number.isNaN(date.valueOf())).sort((a, b) => a - b);

    return {
      id: `ncei-${index}-${Buffer.from(group.key).toString('base64url').slice(0, 12)}`,
      name: group.name, location: group.location, lat: group.lat, lng: group.lng,
      ocean: group.ocean, marineSetting: group.marineSetting,
      samplingMethod: group.samplingMethod,
      score: CLASS_SCORE[concentrationClass.toLowerCase()] ?? 50,
      count: group.count,
      measuredCount: group.concentrationCount,
      avgConcentration: group.concentrationCount
        ? Number((group.concentrationTotal / group.concentrationCount).toFixed(3)) : null,
      unit: group.unit, concentrationClass,
      sampleDateStart: dates[0]?.toISOString().slice(0, 10) || null,
      sampleDateEnd: dates[dates.length - 1]?.toISOString().slice(0, 10) || null,
      references: Array.from(group.references).slice(0, 3),
      accessionUrl: group.accessionUrl, source: SOURCE_NAME,
    };
  });
}

const getPollutionMap = async (req, res) => {
  try {
    const samples = readSamples();
    const hotspots = buildHotspots(samples);
    res.json({
      success: true, source: SOURCE_NAME, sourceUrl: SOURCE_URL,
      dataType: 'archived_field_observations', isLive: false,
      totalReadings: samples.length, totalSites: hotspots.length, hotspots,
    });
  } catch (error) {
    console.error('[Pollution] Could not read microplastics CSV:', error);
    res.status(500).json({ success: false, message: 'Could not load the bundled microplastics dataset' });
  }
};

const getGlobalStats = async (req, res) => {
  try {
    const samples = readSamples();
    const hotspots = buildHotspots(samples);
    const measured = samples.filter((sample) => sample.concentration !== null);
    res.json({
      success: true, source: SOURCE_NAME, isLive: false,
      data: {
        totalReadings: samples.length,
        measuredReadings: measured.length,
        recordsWithoutNumericMeasurement: samples.length - measured.length,
        totalSites: hotspots.length,
        concentrationClasses: Object.fromEntries(
          Object.entries(samples.reduce((acc, sample) => {
            const label = sample.concentrationClass || 'Unclassified';
            acc[label] = (acc[label] || 0) + 1;
            return acc;
          }, {})).sort((a, b) => b[1] - a[1])
        ),
        units: Array.from(new Set(measured.map((sample) => sample.unit).filter(Boolean))).sort(),
      },
    });
  } catch (error) {
    console.error('[Pollution] Could not calculate dataset stats:', error);
    res.status(500).json({ success: false, message: 'Could not load microplastics statistics' });
  }
};

const importDataset = async (req, res) => {
  try {
    cachedSamples = null;
    const samples = readSamples();
    res.json({ success: true, message: 'Bundled microplastics CSV reloaded', importedReadings: samples.length });
  } catch (error) {
    console.error('[Pollution] Dataset reload failed:', error);
    res.status(500).json({ success: false, message: 'Could not reload microplastics CSV' });
  }
};

module.exports = { getPollutionMap, getGlobalStats, importDataset };
