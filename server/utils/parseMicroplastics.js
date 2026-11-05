const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const parseMicroplastics = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    const filePath = path.join(__dirname, '../uploads/microplastics.csv');

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        // Map the CSV columns to match your map's expected structure
        // Note: Replace 'Latitude', 'Longitude', and 'Concentration' with your exact CSV headers
        if (data.Latitude && data.Longitude) {
          results.push({
            lat: parseFloat(data.Latitude),
            lng: parseFloat(data.Longitude),
            score: parseFloat(data.Concentration) || 0,
            id: `sample-${results.length}`
          });
        }
      })
      .on('end', () => {
        // Optional: Slice the array here to limit to the top 500 worst spots so the browser doesn't crash
        resolve(results.slice(0, 500)); 
      })
      .on('error', reject);
  });
};

module.exports = parseMicroplastics;