const mongoose = require('mongoose');

const speciesDetectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    cloudinaryPublicId: {
      type: String,
      default: '',
    },
    metadata: {
      depthMeters: Number,
      waterTempCelsius: Number,
      location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          default: [0, 0],
        },
      },
      scannedAt: {
        type: Date,
        default: Date.now,
      },
    },
    detections: [
      {
        speciesId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Species',
        },
        label: {
          type: String,
          required: true,
        },
        confidence: {
          type: Number,
          required: true,
          min: 0,
          max: 1,
        },
        boundingBox: {
          xMin: { type: Number, required: true },
          yMin: { type: Number, required: true },
          xMax: { type: Number, required: true },
          yMax: { type: Number, required: true },
        },
      },
    ],
    modelUsed: {
      type: String,
      default: 'marine-species-yolo-v8',
    },
    rawModelOutput: {
      type: mongoose.Schema.Types.Mixed,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

speciesDetectionSchema.index({ 'metadata.location': '2dsphere' });
speciesDetectionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SpeciesDetection', speciesDetectionSchema);
