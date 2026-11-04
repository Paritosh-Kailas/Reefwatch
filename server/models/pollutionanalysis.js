const mongoose = require('mongoose');

const pollutionAnalysisSchema = new mongoose.Schema(
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
    debrisDetected: [
      {
        debrisType: {
          type: String,
          enum: ['Plastic Bottle', 'Fishing Gear/Net', 'Plastic Bag', 'Metal Debris', 'Glass', 'Microplastic Particles', 'Other'],
          required: true,
        },
        confidence: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        estimatedVolumeCm3: Number,
        boundingBox: {
          xMin: Number,
          yMin: Number,
          xMax: Number,
          yMax: Number,
        },
      },
    ],
    waterClarityIndex: {
      type: Number, // 0 (Extremely Turbid) to 100 (Crystal Clear)
      min: 0,
      max: 100,
      required: true,
    },
    pollutionSeverity: {
      type: String,
      enum: ['Pristine', 'Low', 'Moderate', 'Critical'],
      required: true,
    },
    riskAssessment: {
      entanglementHazard: { type: Boolean, default: false },
      toxicityRiskLevel: { type: String, enum: ['None', 'Low', 'Medium', 'High'], default: 'None' },
    },
  },
  {
    timestamps: true,
  }
);

pollutionAnalysisSchema.index({ pollutionSeverity: 1, createdAt: -1 });

module.exports = mongoose.model('PollutionAnalysis', pollutionAnalysisSchema);
