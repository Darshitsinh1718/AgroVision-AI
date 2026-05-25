import env from '../config/env.js'
import logger from '../utils/logger.js'
import { runRecommendation } from './recommendationEngine.js'
import { CROP_DB } from '../utils/cropKnowledgeBase.js'

const ML_URL = env.ML_SERVICE_URL || 'http://localhost:8000'
const ML_TIMEOUT = Number(env.ML_SERVICE_TIMEOUT_MS || 15000)

const ML_NAME_MAP = {
  rice: 'rice',
  maize: 'maize',
  chickpea: 'chickpea',
  kidneybeans: 'chickpea',
  pigeonpeas: 'pigeonpea',
  pigeonpea: 'pigeonpea',
  mothbeans: 'lentil',
  mungbean: 'lentil',
  blackgram: 'lentil',
  lentil: 'lentil',
  pomegranate: 'pomegranate',
  banana: 'banana',
  mango: 'mango',
  grapes: 'grapes',
  watermelon: 'watermelon',
  muskmelon: 'muskmelon',
  apple: 'apple',
  orange: 'orange',
  papaya: 'papaya',
  coconut: 'coconut',
  cotton: 'cotton',
  jute: 'jute',
  coffee: 'coffee',

  wheat: 'wheat',
  groundnut: 'groundnut',
  castor: 'castor',
  soybean: 'soybean',
  mustard: 'mustard',
  tomato: 'tomato',
  onion: 'onion',
  potato: 'potato',
  bajra: 'bajra',
  cumin: 'cumin',
  sesame: 'sesame',
  turmeric: 'turmeric',
  sugarcane: 'sugarcane',
}

function normaliseCropName(mlName) {
  if (!mlName) return null

  const key = String(mlName)
    .toLowerCase()
    .replace(/[\s_-]+/g, '')

  if (ML_NAME_MAP[key] !== undefined) {
    return ML_NAME_MAP[key]
  }

  const dbKey = Object.keys(CROP_DB).find(
    k => key.includes(k.toLowerCase()) || k.toLowerCase().includes(key)
  )

  return dbKey || null
}

function normalizeConfidence(rawConfidence) {
  const n = Number(rawConfidence)

  if (Number.isNaN(n)) return 0
  if (n <= 1) return Math.round(n * 100)

  return Math.round(n)
}

async function callMLServer(inputs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), ML_TIMEOUT)

  const payload = {
    N: Number(inputs.N),
    P: Number(inputs.P),
    K: Number(inputs.K),
    temperature: Number(inputs.temp),
    humidity: Number(inputs.humidity),
    ph: Number(inputs.ph),
    rainfall: Number(inputs.rainfall),
  }

  logger.info(`Sending crop input to ML server: ${JSON.stringify(payload)}`)

  try {
    const response = await fetch(`${ML_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timer)

    if (!response.ok) {
      const text = await response.text().catch(() => response.statusText)
      throw new Error(`ML server HTTP ${response.status}: ${text.slice(0, 200)}`)
    }

    const data = await response.json()

    logger.info(`ML raw response: ${JSON.stringify(data)}`)

    const rawCrop =
      data.recommended_crop ??
      data.crop ??
      data.prediction ??
      data.result ??
      ''

    const rawConfidence =
      data.confidence ??
      data.confidence_score ??
      0

    if (!rawCrop) {
      throw new Error(`ML server returned no crop name: ${JSON.stringify(data).slice(0, 200)}`)
    }

    return {
      rawCropName: rawCrop,
      mlConfidence: normalizeConfidence(rawConfidence),
      rawResponse: data,
      topPredictions: data.top_predictions || [],
      receivedInput: data.received_input || payload,
    }
  } catch (err) {
    clearTimeout(timer)
    throw err
  }
}

function buildRuleInput(inputs, context = {}) {
  return {
    N: inputs.N,
    P: inputs.P,
    K: inputs.K,

    nitrogen: inputs.N,
    phosphorus: inputs.P,
    potassium: inputs.K,

    avgTempC: inputs.temp,
    temperature: inputs.temp,

    humidityPercent: inputs.humidity,
    humidity: inputs.humidity,

    ph: inputs.ph,
    pH: inputs.ph,

    annualRainMm: inputs.rainfall,
    rainfall: inputs.rainfall,

    state: context.state || '',
    district: context.district || '',
    season: context.season || '',
    soilType: context.soilType || '',
  }
}

export async function getRecommendation(inputs, context = {}) {
  let mlAttempted = false
  let mlError = null

  try {
    mlAttempted = true

    const {
      rawCropName,
      mlConfidence,
      rawResponse,
      topPredictions,
      receivedInput,
    } = await callMLServer(inputs)

    const cropKey = normaliseCropName(rawCropName)
    const cropData = cropKey ? CROP_DB[cropKey] : null

    const ruleResult = await runRecommendation(buildRuleInput(inputs, context))

    const confidence = mlConfidence || ruleResult.confidence || 0

    if (!cropData) {
      return {
        ...ruleResult,
        recommendedCrop: rawCropName,
        cropKey: rawCropName || 'unknown',
        emoji: '🌿',
        confidence,
        confidenceLabel:
          confidence >= 85
            ? 'Very High'
            : confidence >= 70
              ? 'High'
              : confidence >= 55
                ? 'Moderate'
                : 'Low',
        source: 'ml',
        mlRawCrop: rawCropName,
        mlRawResponse: rawResponse,
        mlTopPredictions: topPredictions,
        mlReceivedInput: receivedInput,
        meta: {
          ...(ruleResult.meta || {}),
          modelVersion: 'random-forest-ml + rule-engine-enrichment',
          mlServiceUsed: true,
          mlEndpoint: `${ML_URL}/predict`,
        },
      }
    }

    return {
      ...ruleResult,
      recommendedCrop: cropData.name || rawCropName,
      cropKey,
      emoji: cropData.emoji || '🌿',
      category: cropData.category || '',
      confidence,
      confidenceLabel:
        confidence >= 85
          ? 'Very High'
          : confidence >= 70
            ? 'High'
            : confidence >= 55
              ? 'Moderate'
              : 'Low',
      riskLevel: cropData.market?.riskLevel || '',
      agronomy: cropData.agronomy || {},
      yield: cropData.yield || {},
      market: cropData.market || {},
      source: 'ml',
      mlRawCrop: rawCropName,
      mlRawResponse: rawResponse,
      mlTopPredictions: topPredictions,
      mlReceivedInput: receivedInput,
      meta: {
        ...(ruleResult.meta || {}),
        modelVersion: 'random-forest-ml + rule-engine-enrichment',
        mlServiceUsed: true,
        mlEndpoint: `${ML_URL}/predict`,
      },
    }
  } catch (err) {
    mlError = err.message || String(err)

    logger.warn(`ML service failed. Using rule engine fallback. Reason: ${mlError}`)

    const fallback = await runRecommendation(buildRuleInput(inputs, context))

    return {
      ...fallback,
      source: 'rule-engine',
      mlAttempted,
      mlError,
      meta: {
        ...(fallback.meta || {}),
        modelVersion: 'rule-engine-fallback',
        mlServiceUsed: false,
        mlEndpoint: `${ML_URL}/predict`,
        fallbackReason: mlError,
      },
    }
  }
}

export async function checkMLHealth() {
  try {
    const res = await fetch(`${ML_URL}/health`, {
      signal: AbortSignal.timeout(3000),
    })

    return {
      ok: res.ok,
      status: res.status,
      url: ML_URL,
    }
  } catch (err) {
    return {
      ok: false,
      error: err.message,
      url: ML_URL,
    }
  }
}