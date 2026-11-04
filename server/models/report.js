const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
    },
    siteName: {
      type: String,
      required: [true, 'Site name is required'],
      trim: true,
    },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    summary: {
      totalScansIncluded: { type: Number, default: 0 },
      overallHealthIndex: { type: Number, min: 0, max: 100 },
      dominantSpecies: [String],
      dominantThreats: [String],
    },
    linkedAnalyses: {
      speciesDetections: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'SpeciesDetection',
        },
      ],
      coralAnalyses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'CoralAnalysis',
        },
      ],
      pollutionAnalyses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'PollutionAnalysis',
        },
      ],
      densityAnalyses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'DensityAnalysis',
        },
      ],
    },
    status: {
      type: String,
      enum: ['Draft', 'Finalized', 'Archived'],
      default: 'Draft',
    },
    exportUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

reportSchema.index({ userId: 1, siteName: 1 });

module.exports = mongoose.model('Report', reportSchema);
