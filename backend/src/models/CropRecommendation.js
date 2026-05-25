// src/models/CropRecommendation.js
// ─────────────────────────────────────────────────────────
// UPDATED: Extended schema to store all fields produced by
// the recommendation engine:
//   • Extended inputs: soilType, season, state, district
//   • Full agronomy guidance object
//   • Fertilizer & irrigation advice arrays
//   • Market info, risk level, yield range
//   • Per-parameter scores (for frontend radar chart)
// ─────────────────────────────────────────────────────────

import mongoose from 'mongoose'

const { Schema } = mongoose

const CropRecommendationSchema = new Schema(
  {
    // ── User link ───────────────────────────────────────
    user: {
      type:  Schema.Types.ObjectId,
      ref:   'User',
      index: true,
      // Not required — allow anonymous/demo recommendations
    },

    // ── Soil & environment inputs ───────────────────────
    inputs: {
      nitrogen:    { type: Number, required: true, min: 0 },
      phosphorus:  { type: Number, required: true, min: 0 },
      potassium:   { type: Number, required: true, min: 0 },
      ph:          { type: Number, required: true, min: 0,  max: 14 },
      temperature: { type: Number, required: true },
      humidity:    { type: Number, required: true, min: 0,  max: 100 },
      rainfall:    { type: Number, required: true, min: 0 },
    },

    // ── Contextual inputs ───────────────────────────────
    context: {
      soilType: { type: String, default: '' },
      season:   { type: String, enum: ['kharif', 'rabi', 'zaid', 'year-round', ''], default: '' },
      state:    { type: String, default: '' },
      district: { type: String, default: '' },
      fieldName:{ type: String, default: '' },
    },

    // ── Primary recommendation ──────────────────────────
    recommendedCrop: { type: String, required: true },
    cropKey:         { type: String, required: true },
    emoji:           { type: String, default: '🌿' },
    category:        { type: String, default: '' },
    confidence:      { type: Number, min: 0, max: 100 },
    confidenceLabel: { type: String, enum: ['Very High', 'High', 'Moderate', 'Low'], default: 'Moderate' },

    // Explanation
    reasons:  [{ type: String }],
    warnings: [{ type: String }],

    // ── Alternatives (top 4 other crops) ───────────────
    alternatives: [
      {
        cropKey:    String,
        name:       String,
        emoji:      String,
        confidence: Number,
        category:   String,
        reasons:    [String],
        _id:        false,
      },
    ],

    // ── Agronomic guidance ──────────────────────────────
    agronomy: {
      sowingTime:    String,
      harvestTime:   String,
      waterNeeds:    String,
      fertilizerTip: String,
      irrigationTip: String,
      organicTip:    String,
      tips:          [String],
    },

    // ── Tailored advice arrays ──────────────────────────
    fertilizerAdvice: [{ type: String }],
    irrigationAdvice: [{ type: String }],

    // ── Yield & market info ─────────────────────────────
    yield: {
      min:     Number,
      max:     Number,
      unit:    String,
      avgIndia: Number,
    },

    market: {
      demand:          String,
      priceStability:  String,
      mspAvailable:    Boolean,
      exportPotential: String,
      riskLevel:       String,
    },

    riskLevel: { type: String, default: 'Moderate' },

    // ── Per-parameter scores (0–1) for radar chart ─────
    paramScores: {
      N:        Number,
      P:        Number,
      K:        Number,
      ph:       Number,
      temp:     Number,
      humidity: Number,
      rainfall: Number,
    },

    // ── Suitable seasons (from crop DB) ────────────────
    suitableSeasons: [{ type: String }],

    // ── Engine metadata ─────────────────────────────────
    modelVersion:        { type: String, default: 'rule-engine-v2.0' },
    latencyMs:           Number,
    totalCropsEvaluated: Number,
  },
  {
    timestamps: true,   // createdAt, updatedAt auto-managed
    versionKey: false,
  }
)

// ── Indexes ──────────────────────────────────────────────
CropRecommendationSchema.index({ user: 1, createdAt: -1 })
CropRecommendationSchema.index({ recommendedCrop: 1 })
CropRecommendationSchema.index({ 'context.state': 1 })
CropRecommendationSchema.index({ 'context.season': 1 })

const CropRecommendation = mongoose.model('CropRecommendation', CropRecommendationSchema)
export default CropRecommendation