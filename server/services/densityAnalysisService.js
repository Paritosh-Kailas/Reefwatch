const DensityAnalysis = require('../models/densityanalysis');

const analyzeDensity = async ({ imageUrl, userId }) => {
  const mockResult = {
    imageUrl,
    uploadedBy: userId,
    coralCoveragePercent: 48,
    algaeCoveragePercent: 30,
    sandOrRubblePercent: 22,
    densityClassification: 'Moderate',
  };
  return await DensityAnalysis.create(mockResult);
};

module.exports = { analyzeDensity };
