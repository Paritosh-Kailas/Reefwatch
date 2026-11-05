/**
 * Pollution Controller
 * Handles marine pollution & debris data for the global map
 */

const MOCK_REEF_POLLUTION_DATA = [
  { id: 1, name: "Great Barrier Reef", location: "Australia", lat: -18.2871, lng: 147.6992, pollutionSeverity: "Moderate", waterClarity: 48, debrisCount: 7, primaryDebris: "Plastic Bottle", entanglementHazard: true, toxicityRisk: "Medium" },
  { id: 2, name: "Coral Triangle - Raja Ampat", location: "Indonesia", lat: -0.5897, lng: 130.1095, pollutionSeverity: "Low", waterClarity: 82, debrisCount: 2, primaryDebris: "Microplastic Particles", entanglementHazard: false, toxicityRisk: "Low" },
  { id: 3, name: "Florida Keys Reef", location: "USA", lat: 24.5551, lng: -81.7800, pollutionSeverity: "Critical", waterClarity: 28, debrisCount: 18, primaryDebris: "Fishing Gear/Net", entanglementHazard: true, toxicityRisk: "High" },
  { id: 4, name: "Mesoamerican Barrier Reef", location: "Belize", lat: 17.2510, lng: -87.5490, pollutionSeverity: "Moderate", waterClarity: 55, debrisCount: 9, primaryDebris: "Plastic Bag", entanglementHazard: false, toxicityRisk: "Medium" },
  { id: 5, name: "Red Sea Reef", location: "Egypt", lat: 27.2000, lng: 33.8333, pollutionSeverity: "Low", waterClarity: 72, debrisCount: 3, primaryDebris: "Microplastic Particles", entanglementHazard: false, toxicityRisk: "Low" },
  { id: 6, name: "Tubbataha Reef", location: "Philippines", lat: 8.7667, lng: 119.9000, pollutionSeverity: "Low", waterClarity: 79, debrisCount: 2, primaryDebris: "Plastic Bottle", entanglementHazard: false, toxicityRisk: "None" },
  { id: 7, name: "Chagos Archipelago", location: "British Indian Ocean", lat: -6.3600, lng: 71.8700, pollutionSeverity: "Pristine", waterClarity: 95, debrisCount: 0, primaryDebris: null, entanglementHazard: false, toxicityRisk: "None" },
  { id: 8, name: "Maldives Reefs", location: "Maldives", lat: 3.2028, lng: 73.2207, pollutionSeverity: "Moderate", waterClarity: 60, debrisCount: 8, primaryDebris: "Plastic Bottle", entanglementHazard: false, toxicityRisk: "Medium" },
  { id: 9, name: "Palau Barrier Reef", location: "Palau", lat: 7.3410, lng: 134.4790, pollutionSeverity: "Low", waterClarity: 85, debrisCount: 1, primaryDebris: "Glass", entanglementHazard: false, toxicityRisk: "None" },
  { id: 10, name: "New Caledonia Reef", location: "France (Pacific)", lat: -21.3000, lng: 165.3000, pollutionSeverity: "Low", waterClarity: 70, debrisCount: 4, primaryDebris: "Plastic Bag", entanglementHazard: false, toxicityRisk: "Low" },
  { id: 11, name: "Hawaii Reef Systems", location: "USA", lat: 21.3069, lng: -157.8583, pollutionSeverity: "Moderate", waterClarity: 50, debrisCount: 10, primaryDebris: "Plastic Bottle", entanglementHazard: true, toxicityRisk: "Medium" },
  { id: 12, name: "Andaman Sea Reef", location: "Thailand", lat: 7.9519, lng: 98.3381, pollutionSeverity: "Moderate", waterClarity: 55, debrisCount: 11, primaryDebris: "Fishing Gear/Net", entanglementHazard: true, toxicityRisk: "Medium" },
  { id: 13, name: "Gulf of Oman Reef", location: "Oman", lat: 22.5000, lng: 59.5000, pollutionSeverity: "Low", waterClarity: 68, debrisCount: 3, primaryDebris: "Metal Debris", entanglementHazard: false, toxicityRisk: "Low" },
  { id: 14, name: "Mayotte Lagoon", location: "France (Indian Ocean)", lat: -12.8275, lng: 45.1662, pollutionSeverity: "Low", waterClarity: 76, debrisCount: 3, primaryDebris: "Plastic Bag", entanglementHazard: false, toxicityRisk: "Low" },
  { id: 15, name: "Bermuda Platform Reef", location: "Bermuda", lat: 32.3078, lng: -64.7505, pollutionSeverity: "Critical", waterClarity: 30, debrisCount: 20, primaryDebris: "Microplastic Particles", entanglementHazard: false, toxicityRisk: "High" },
  { id: 16, name: "Ningaloo Reef", location: "Australia", lat: -22.6774, lng: 113.7437, pollutionSeverity: "Pristine", waterClarity: 90, debrisCount: 1, primaryDebris: "Glass", entanglementHazard: false, toxicityRisk: "None" },
  { id: 17, name: "Cocos Island Reef", location: "Costa Rica", lat: 5.5333, lng: -87.0667, pollutionSeverity: "Low", waterClarity: 80, debrisCount: 2, primaryDebris: "Fishing Gear/Net", entanglementHazard: true, toxicityRisk: "Low" },
  { id: 18, name: "Galapagos Marine Reserve", location: "Ecuador", lat: -0.6667, lng: -90.5500, pollutionSeverity: "Low", waterClarity: 75, debrisCount: 3, primaryDebris: "Plastic Bottle", entanglementHazard: false, toxicityRisk: "None" },
  { id: 19, name: "Gulf of Mexico Reef", location: "Mexico", lat: 19.4326, lng: -89.1333, pollutionSeverity: "Critical", waterClarity: 20, debrisCount: 25, primaryDebris: "Fishing Gear/Net", entanglementHazard: true, toxicityRisk: "High" },
  { id: 20, name: "Caribbean - Virgin Islands", location: "US Virgin Islands", lat: 18.3358, lng: -64.8963, pollutionSeverity: "Critical", waterClarity: 25, debrisCount: 22, primaryDebris: "Plastic Bottle", entanglementHazard: true, toxicityRisk: "High" },
  { id: 21, name: "Spermonde Archipelago", location: "Indonesia", lat: -5.0100, lng: 119.3300, pollutionSeverity: "Critical", waterClarity: 22, debrisCount: 30, primaryDebris: "Plastic Bag", entanglementHazard: false, toxicityRisk: "High" },
  { id: 22, name: "Okinawa Reef", location: "Japan", lat: 26.3344, lng: 127.8056, pollutionSeverity: "Moderate", waterClarity: 58, debrisCount: 6, primaryDebris: "Plastic Bottle", entanglementHazard: false, toxicityRisk: "Medium" },
  { id: 23, name: "Sri Lanka Reef", location: "Sri Lanka", lat: 7.8731, lng: 80.7718, pollutionSeverity: "Moderate", waterClarity: 50, debrisCount: 12, primaryDebris: "Fishing Gear/Net", entanglementHazard: true, toxicityRisk: "Medium" },
  { id: 24, name: "Mozambique Channel Reef", location: "Mozambique", lat: -17.2683, lng: 35.5366, pollutionSeverity: "Low", waterClarity: 65, debrisCount: 4, primaryDebris: "Plastic Bottle", entanglementHazard: false, toxicityRisk: "Low" },
  { id: 25, name: "Comoros Reef", location: "Comoros", lat: -11.6455, lng: 43.3333, pollutionSeverity: "Low", waterClarity: 70, debrisCount: 3, primaryDebris: "Plastic Bag", entanglementHazard: false, toxicityRisk: "Low" },
];

/** GET /api/pollution/map
 * Returns hotspots shaped for MarineMapView:
 *   { hotspots: [{id, lat, lng, score, count, name}], totalReadings }
 */
const getPollutionMap = async (req, res) => {
  try {
    // Transform mock data to the shape MarineMapView expects
    const hotspots = MOCK_REEF_POLLUTION_DATA.map((r) => ({
      id: r.id,
      lat: r.lat,
      lng: r.lng,
      name: r.name,
      location: r.location,
      score: r.waterClarity != null ? Math.round(100 - r.waterClarity) : 50, // invert: low clarity = high pollution score
      count: r.debrisCount,
      scans: 0,
      pollutionSeverity: r.pollutionSeverity,
      primaryDebris: r.primaryDebris,
      entanglementHazard: r.entanglementHazard,
      toxicityRisk: r.toxicityRisk,
    }));

    const totalReadings = hotspots.reduce((sum, h) => sum + h.count, 0);
    res.json({ success: true, hotspots, totalReadings });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching pollution data' });
  }
};

/** GET /api/pollution/stats */
const getGlobalStats = async (req, res) => {
  try {
    const total = MOCK_REEF_POLLUTION_DATA.length;
    const critical = MOCK_REEF_POLLUTION_DATA.filter(r => r.pollutionSeverity === 'Critical').length;
    const pristine = MOCK_REEF_POLLUTION_DATA.filter(r => r.pollutionSeverity === 'Pristine').length;
    const avgClarity = Math.round(MOCK_REEF_POLLUTION_DATA.reduce((s, r) => s + r.waterClarity, 0) / total);
    const hazardous = MOCK_REEF_POLLUTION_DATA.filter(r => r.entanglementHazard).length;
    res.json({ success: true, data: { total, critical, pristine, avgWaterClarity: avgClarity, hazardousReefs: hazardous } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
};

/** POST /api/pollution/import — import dataset (stub) */
const importDataset = async (req, res) => {
  res.json({ success: true, message: 'Dataset import endpoint ready (not yet implemented)' });
};

module.exports = { getPollutionMap, getGlobalStats, importDataset };
