// backend/src/routes/marketRoutes.js
// Register in agrovision-backend/src/routes/index.js:
//   import { marketRouter, schemesRouter } from './marketRoutes.js'
//   router.use('/market',  marketRouter)
//   router.use('/schemes', schemesRouter)

import { Router } from 'express'
import {
  getNearestYardsController, getYardsController,
  getYardPricesController, compareYardsController, getYardMeta,
  getMandiPrices, getMarketSummaryController,
  getCommodityHistoryController, getBestMarketsController, getMarketMeta,
  getSchemes, getSchemesStats, getSchemeByIdController, getSchemeRecommendations,
} from '../controllers/marketController.js'

export const marketRouter = Router()
// Specific routes BEFORE parameterized ones
marketRouter.get('/nearest',            getNearestYardsController)
marketRouter.get('/yards',              getYardsController)
marketRouter.get('/yardprices',         getYardPricesController)
marketRouter.get('/compare',            compareYardsController)
marketRouter.get('/yardmeta',           getYardMeta)
marketRouter.get('/summary',            getMarketSummaryController)
marketRouter.get('/meta',               getMarketMeta)
marketRouter.get('/history/:commodity', getCommodityHistoryController)
marketRouter.get('/best/:commodity',    getBestMarketsController)
marketRouter.get('/',                   getMandiPrices)

export const schemesRouter = Router()
schemesRouter.get('/stats',      getSchemesStats)
schemesRouter.post('/recommend', getSchemeRecommendations)
schemesRouter.get('/:id',        getSchemeByIdController)
schemesRouter.get('/',           getSchemes)

export default marketRouter