const mongoose = require('mongoose');

const speciesSchema = new mongoose.Schema(
  {
    scientificName: {
      type: String,
      required: [true, 'Scientific name is required'],
      unique: true,
      trim: true,
    },
    commonName: {
      type: String,
      required: [true, 'Common name is required'],
      trim: true,
    },
    family: {
      type: String,
      trim: true,
      default: 'Unknown',
    },
    category: {
      type: String,
      enum: ['Coral', 'Fish', 'Invertebrate', 'Algae', 'Reptile', 'Mammal'],
      required: true,
    },
    iucnStatus: {
      type: String,
      enum: ['LC', 'NT', 'VU', 'EN', 'CR', 'EW', 'EX', 'DD'],
      default: 'DD',
    },
    morphology: {
      type: String,
      enum: ['Branching', 'Massive', 'Encrusting', 'Foliose', 'Plate', 'Solitary', 'N/A'],
      default: 'N/A',
    },
    depthRangeMeters: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 50 },
    },
    description: {
      type: String,
      trim: true,
    },
    referenceImages: [
      {
        url: { type: String, required: true },
        caption: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

speciesSchema.index({ scientificName: 'text', commonName: 'text' });

module.exports = mongoose.model('Species', speciesSchema);
