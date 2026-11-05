/**
 * Pollution Controller
 * Handles marine pollution & debris data for the global map
 */
const parseMicroplastics = require('../utils/parseMicroplastics');

// Fallback data just in case the CSV file gets deleted or fails to load
const MOCK_REEF_POLLUTION_DATA = [
  { id: 1, name: "Great Barrier Reef", location: "Australia", lat: -18.2871, lng: 147.6992, pollutionSeverity: "Moderate", waterClarity: 75 },
  { id: 2, name: "Coral Triangle", location: "Indonesia", lat: -0.5897, lng: 130.1095, pollutionSeverity: "Low", waterClarity: 90 },
  { id: 3, name: "Florida Keys Reef", location: "USA", lat: 24.5551, lng: -81.7800, pollutionSeverity: "Critical", waterClarity: 40 }
];

exports.getPollutionHotspots = async (req, res) => {
  try {
    // 1. Fetch the raw data from the CSV
    const hotspots = await parseMicroplastics();
    
    // 2. Format the CSV data to match what the React map expects
    const formattedHotspots = hotspots.map((spot, index) => {
      // Determine string severity based on the numeric score from the CSV
      let severity = "Low";
      if (spot.score > 10) severity = "Critical";
      else if (spot.score > 5) severity = "Moderate";

      return {
        id: spot.id || `csv-${index}`,
        name: `Microplastics Node ${index + 1}`,
        location: "Ocean Data",
        lat: spot.lat,
        lng: spot.lng,
        pollutionSeverity: severity,
        waterClarity: Math.max(0, 100 - (spot.score * 5)) // Placeholder clarity calculation
      };
    });

    // 3. Send the formatted CSV data to the frontend
    res.json(formattedHotspots);

  } catch (error) {
    console.error("CSV loading error, falling back to mock data:", error);
    // If the CSV fails, send the mock data so the map doesn't break
    res.json(MOCK_REEF_POLLUTION_DATA); 
  }
};