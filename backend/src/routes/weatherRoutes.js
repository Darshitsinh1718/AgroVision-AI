import { Router } from 'express'

import {
  getWeather,
  getCurrentWeather,
  getForecast,
  getFarmingAdvice,
  geocode,
} from '../controllers/weatherController.js'

const router = Router()

router.get('/', getWeather)
router.get('/current', getCurrentWeather)
router.get('/forecast', getForecast)
router.get('/farming', getFarmingAdvice)
router.get('/geocode', geocode)

export default router