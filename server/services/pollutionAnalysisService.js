const PollutionAnalysis = require('../models/pollutionanalysis');

const analyzePollution = async ({ imageUrl, userId }) => {
  const mockResult = {
    imageUrl,
    uploadedBy: userId,
    debrisDetected: ['Plastic Bottle', 'Fishing Net'],
    waterClarityIndex: 55,
    pollutionSeverity: 'Moderate',
    toxicityRisk: 'Medium',
  };
  return await PollutionAnalysis.create(mockResult);
};

module.exports = { analyzePollution };
