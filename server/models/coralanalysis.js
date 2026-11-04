const mongoose = require('mongoose');

const coralAnalysisSchema = new mongoose.Schema(
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
    coralType: {
      type: String,
      enum: ['Brain Coral', 'Staghorn Coral', 'Pillar Coral', 'Table Coral', 'Elkhorn Coral', 'Other', 'Unidentified'],
      default: 'Unidentified',
    },
    bleachingSeverity: {
      type: String,
      enum: ['Healthy', 'Mild Bleaching', 'Moderate Bleaching', 'Severe Bleaching', 'Dead'],
      required: true,
    },
    bleachingPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 10,
      required: true,
    },
    segmentationMaskUrl: {
      type: String,
      default: '',
    },
    morphologicalNotes: {
      type: String,
      trim: true,
    },
    modelDetails: {
      hfModelName: { type: String, default: 'coral-segmentation-vit' },
      inferenceTimeMs: Number,
    },
  },
  {
    timestamps: true,
  }
);

coralAnalysisSchema.index({ bleachingSeverity: 1, createdAt: -1 });

module.exports = mongoose.model('CoralAnalysis', coralAnalysisSchema);
