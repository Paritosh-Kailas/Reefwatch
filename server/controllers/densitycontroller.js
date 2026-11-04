/**
 * Density Controller
 * Handles coral coverage & density data for the global map
 */

// Mock reef density data - 25 major reef systems worldwide
const MOCK_REEF_DENSITY_DATA = [
  { id: 1, name: "Great Barrier Reef", location: "Australia", lat: -18.2871, lng: 147.6992, coralCoverage: 22, algaeCoverage: 45, sandOrRubble: 33, densityClass: "Sparse", heatIntensity: 0.3 },
  { id: 2, name: "Coral Triangle - Raja Ampat", location: "Indonesia", lat: -0.5897, lng: 130.1095, coralCoverage: 75, algaeCoverage: 15, sandOrRubble: 10, densityClass: "Dense", heatIntensity: 0.95 },
  { id: 3, name: "Florida Keys Reef", location: "USA", lat: 24.5551, lng: -81.7800, coralCoverage: 15, algaeCoverage: 55, sandOrRubble: 30, densityClass: "Sparse", heatIntensity: 0.2 },
  { id: 4, name: "Mesoamerican Barrier Reef", location: "Belize", lat: 17.2510, lng: -87.5490, coralCoverage: 42, algaeCoverage: 30, sandOrRubble: 28, densityClass: "Moderate", heatIntensity: 0.55 },
  { id: 5, name: "Red Sea Reef", location: "Egypt", lat: 27.2000, lng: 33.8333, coralCoverage: 60, algaeCoverage: 20, sandOrRubble: 20, densityClass: "Dense", heatIntensity: 0.8 },
  { id: 6, name: "Tubbataha Reef", location: "Philippines", lat: 8.7667, lng: 119.9000, coralCoverage: 68, algaeCoverage: 18, sandOrRubble: 14, densityClass: "Dense", heatIntensity: 0.88 },
  { id: 7, name: "Chagos Archipelago", location: "British Indian Ocean", lat: -6.3600, lng: 71.8700, coralCoverage: 70, algaeCoverage: 12, sandOrRubble: 18, densityClass: "Dense", heatIntensity: 0.9 },
  { id: 8, name: "Maldives Reefs", location: "Maldives", lat: 3.2028, lng: 73.2207, coralCoverage: 50, algaeCoverage: 25, sandOrRubble: 25, densityClass: "Moderate", heatIntensity: 0.65 },
  { id: 9, name: "Palau Barrier Reef", location: "Palau", lat: 7.3410, lng: 134.4790, coralCoverage: 72, algaeCoverage: 14, sandOrRubble: 14, densityClass: "Dense", heatIntensity: 0.92 },
  { id: 10, name: "New Caledonia Reef", location: "France (Pacific)", lat: -21.3000, lng: 165.3000, coralCoverage: 55, algaeCoverage: 25, sandOrRubble: 20, densityClass: "Moderate", heatIntensity: 0.7 },
  { id: 11, name: "Hawaii Reef Systems", location: "USA", lat: 21.3069, lng: -157.8583, coralCoverage: 30, algaeCoverage: 40, sandOrRubble: 30, densityClass: "Moderate", heatIntensity: 0.4 },
  { id: 12, name: "Andaman Sea Reef", location: "Thailand", lat: 7.9519, lng: 98.3381, coralCoverage: 38, algaeCoverage: 35, sandOrRubble: 27, densityClass: "Moderate", heatIntensity: 0.5 },
  { id: 13, name: "Gulf of Oman Reef", location: "Oman", lat: 22.5000, lng: 59.5000, coralCoverage: 28, algaeCoverage: 42, sandOrRubble: 30, densityClass: "Sparse", heatIntensity: 0.35 },
  { id: 14, name: "Mayotte Lagoon", location: "France (Indian Ocean)", lat: -12.8275, lng: 45.1662, coralCoverage: 62, algaeCoverage: 20, sandOrRubble: 18, densityClass: "Dense", heatIntensity: 0.82 },
  { id: 15, name: "Bermuda Platform Reef", location: "Bermuda", lat: 32.3078, lng: -64.7505, coralCoverage: 18, algaeCoverage: 50, sandOrRubble: 32, densityClass: "Sparse", heatIntensity: 0.22 },
  { id: 16, name: "Ningaloo Reef", location: "Australia", lat: -22.6774, lng: 113.7437, coralCoverage: 48, algaeCoverage: 28, sandOrRubble: 24, densityClass: "Moderate", heatIntensity: 0.62 },
  { id: 17, name: "Cocos Island Reef", location: "Costa Rica", lat: 5.5333, lng: -87.0667, coralCoverage: 65, algaeCoverage: 20, sandOrRubble: 15, densityClass: "Dense", heatIntensity: 0.85 },
  { id: 18, name: "Galapagos Marine Reserve", location: "Ecuador", lat: -0.6667, lng: -90.5500, coralCoverage: 32, algaeCoverage: 40, sandOrRubble: 28, densityClass: "Moderate", heatIntensity: 0.42 },
  { id: 19, name: "Gulf of Mexico Reef", location: "Mexico", lat: 19.4326, lng: -89.1333, coralCoverage: 12, algaeCoverage: 60, sandOrRubble: 28, densityClass: "Sparse", heatIntensity: 0.15 },
  { id: 20, name: "Caribbean - Virgin Islands", location: "US Virgin Islands", lat: 18.3358, lng: -64.8963, coralCoverage: 20, algaeCoverage: 50, sandOrRubble: 30, densityClass: "Sparse", heatIntensity: 0.25 },
  { id: 21, name: "Spermonde Archipelago", location: "Indonesia", lat: -5.0100, lng: 119.3300, coralCoverage: 35, algaeCoverage: 40, sandOrRubble: 25, densityClass: "Moderate", heatIntensity: 0.45 },
  { id: 22, name: "Okinawa Reef", location: "Japan", lat: 26.3344, lng: 127.8056, coralCoverage: 44, algaeCoverage: 30, sandOrRubble: 26, densityClass: "Moderate", heatIntensity: 0.57 },
  { id: 23, name: "Sri Lanka Reef", location: "Sri Lanka", lat: 7.8731, lng: 80.7718, coralCoverage: 29, algaeCoverage: 44, sandOrRubble: 27, densityClass: "Sparse", heatIntensity: 0.37 },
  { id: 24, name: "Mozambique Channel Reef", location: "Mozambique", lat: -17.2683, lng: 35.5366, coralCoverage: 52, algaeCoverage: 26, sandOrRubble: 22, densityClass: "Moderate", heatIntensity: 0.67 },
  { id: 25, name: "Comoros Reef", location: "Comoros", lat: -11.6455, lng: 43.3333, coralCoverage: 58, algaeCoverage: 22, sandOrRubble: 20, densityClass: "Dense", heatIntensity: 0.75 },
];

/**
 * GET /api/density/map
 * Returns all reef density data for map visualization
 */
const getMapData = async (req, res) => {
  try {
    // In production, query MongoDB:
    // const data = await DensityAnalysis.find().select(...).lean();
    res.json({
      success: true,
      count: MOCK_REEF_DENSITY_DATA.length,
      data: MOCK_REEF_DENSITY_DATA,
    });
  } catch (error) {
    console.error('[DensityController] getMapData error:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching density data' });
  }
};

/**
 * GET /api/density/stats
 * Returns aggregated global stats
 */
const getGlobalStats = async (req, res) => {
  try {
    const totalReefs = MOCK_REEF_DENSITY_DATA.length;
    const avgCoverage = Math.round(MOCK_REEF_DENSITY_DATA.reduce((sum, r) => sum + r.coralCoverage, 0) / totalReefs);
    const denseReefs = MOCK_REEF_DENSITY_DATA.filter(r => r.densityClass === 'Dense').length;
    const sparseReefs = MOCK_REEF_DENSITY_DATA.filter(r => r.densityClass === 'Sparse').length;

    res.json({
      success: true,
      data: {
        totalReefs,
        avgCoralCoverage: avgCoverage,
        denseReefs,
        moderateReefs: totalReefs - denseReefs - sparseReefs,
        sparseReefs,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};

module.exports = { getMapData, getGlobalStats };
