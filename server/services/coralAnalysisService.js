// Stub: will call HF model and persist CoralAnalysis to MongoDB
const CoralAnalysis = require('../models/coralanalysis');

const analyzeCoralImage = async ({ imageUrl, userId }) => {
  // TODO: download image, run HF inference, parse result
  const mockResult = {
    imageUrl,
    uploadedBy: userId,
    coralType: 'Staghorn Coral',
    bleachingSeverity: 'Mild',
    healthScore: 72,
    confidenceScore: 0.88,
    analysisNotes: 'Mild bleaching detected on branch tips.',
  };
  return await CoralAnalysis.create(mockResult);
};

module.exports = { analyzeCoralImage };
