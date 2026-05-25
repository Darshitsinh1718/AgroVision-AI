import mongoose from 'mongoose'

const { Schema } = mongoose

const TreatmentSchema = new Schema({
  type: { type: String, default: 'general' },
  name: { type: String, default: '' },
  dosage: { type: String, default: '' },
  frequency: { type: String, default: '' },
  notes: { type: String, default: '' },
}, { _id: false })

const CropScanSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
      index: true,
    },

    imagePath: { type: String, default: 'memory-upload' },
    imageUrl: { type: String, default: '' },
    originalName: { type: String, default: '' },
    mimeType: { type: String, default: '' },
    fileSizeBytes: { type: Number, default: 0 },

    cropType: { type: String, default: 'Unknown', trim: true },
    diseaseDetected: { type: String, default: 'Unknown', trim: true },

    isHealthy: { type: Boolean, default: false },

    confidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },

    severity: {
      type: String,
      default: 'low',
    },

    topPredictions: [
      {
        label: { type: String, default: '' },
        confidence: { type: Number, default: 0 },
        _id: false,
      },
    ],

    treatments: {
      type: [TreatmentSchema],
      default: [],
    },

    advisory: {
      summary: { type: String, default: '' },
      prevention: { type: String, default: '' },
      urgency: { type: String, default: 'low' },
    },

    fertilizerSuggestions: {
      type: [String],
      default: [],
    },

    organicSolutions: {
      type: [String],
      default: [],
    },

    preventionTips: {
      type: [String],
      default: [],
    },

    mlModelVersion: { type: String, default: 'fallback-v1' },
    mlLatencyMs: { type: Number, default: 0 },

    fieldName: { type: String, default: '' },

    status: {
      type: String,
      default: 'completed',
    },

    errorMessage: { type: String, default: '' },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: false,
  }
)

CropScanSchema.index({ user: 1, createdAt: -1 })
CropScanSchema.index({ cropType: 1 })
CropScanSchema.index({ diseaseDetected: 1 })
CropScanSchema.index({ status: 1 })

const CropScan = mongoose.model('CropScan', CropScanSchema)

export default CropScan