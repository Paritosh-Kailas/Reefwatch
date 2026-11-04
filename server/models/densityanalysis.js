const mongoose = require('mongoose');

const densityAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    coralCoveragePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    algaeCoveragePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    sandOrRubblePercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    coralToAlgaeRatio: {
      type: Number,
      default: 0,
    },
    densityClassification: {
      type: String,
      enum: ['Sparse', 'Moderate', 'Dense', 'Overgrown'],
      required: true,
    },
    heatmapOverlayUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('DensityAnalysis', densityAnalysisSchema);
