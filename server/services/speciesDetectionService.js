const SpeciesDetection = require('../models/speciesdetection');

const detectSpecies = async ({ imageUrl, userId }) => {
  const mockResult = {
    imageUrl,
    uploadedBy: userId,
    detectedSpecies: [{ speciesName: 'Clownfish', confidence: 0.91 }],
    totalSpeciesCount: 1,
  };
  return await SpeciesDetection.create(mockResult);
};

module.exports = { detectSpecies };
