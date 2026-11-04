const mongoose = require('mongoose');
 
// Scans need a user and an image; rows imported from a dataset do not.
const forScansOnly = function () {
  return this.source !== 'dataset';
};
 
const pollutionAnalysisSchema = new mongoose.Schema(
  {
    source: { type: String, enum: ['scan', 'dataset'], default: 'scan', index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: forScansOnly },
    imageUrl: { type: String, required: forScansOnly },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] }, // [longitude, latitude]
    },
    pollutionScore: { type: Number, min: 0, max: 100 }, // 0-100, set for dataset rows
    debrisDetected: [
      {
        debrisType: {
          type: String,
          enum: ['Plastic Bottle', 'Fishing Gear/Net', 'Plastic Bag', 'Metal Debris', 'Glass', 'Microplastic Particles', 'Other'],
          required: true,
        },
        confidence: { type: Number, required: true, min: 0, max: 1 },
        estimatedVolumeCm3: Number,
        boundingBox: { xMin: Number, yMin: Number, xMax: Number, yMax: Number },
      },
    ],
    waterClarityIndex: { type: Number, min: 0, max: 100, required: forScansOnly }, // 0 turbid, 100 clear
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
  { timestamps: true }
);
 
pollutionAnalysisSchema.index({ pollutionSeverity: 1, createdAt: -1 });
pollutionAnalysisSchema.index({ location: '2dsphere' });
 
module.exports = mongoose.model('PollutionAnalysis', pollutionAnalysisSchema);
 