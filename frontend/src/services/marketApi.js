// frontend/src/services/marketApi.js
// Axios service for all market/mandi API calls to our backend

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const marketAxios = axios.create({
  baseURL: `${BASE_URL}/market`,
  timeout: 15000,
});

// ─── Health check ──────────────────────────────────────────────────────────────
export async function checkMarketHealth() {
  const { data } = await marketAxios.get('/health');
  return data;
}

// ─── Get nearest market prices (auto-detects from user profile) ───────────────
/**
 * @param {Object} profile - { state, district, taluka }
 * @param {string} [commodity]
 */
export async function fetchNearestMarketPrices(profile = {}, commodity = '') {
  const params = {
    state: profile.state || 'Gujarat',
    district: profile.district || '',
    taluka: profile.taluka || '',
  };
  if (commodity) params.commodity = commodity;

  const { data } = await marketAxios.get('/nearest', { params });
  return data;
}

// ─── Get prices with custom filters ───────────────────────────────────────────
/**
 * @param {Object} filters - { state, district, market, commodity, limit, offset }
 */
export async function fetchMandiPrices(filters = {}) {
  const params = {};
  if (filters.state) params.state = filters.state;
  if (filters.district) params.district = filters.district;
  if (filters.market) params.market = filters.market;
  if (filters.commodity) params.commodity = filters.commodity;
  if (filters.limit) params.limit = filters.limit;
  if (filters.offset) params.offset = filters.offset;

  // Backend uses root route for mandi prices: GET /api/.../market?state=...&commodity=...
  const { data } = await marketAxios.get('/', { params });
  return data;
}

// ─── Get available markets ─────────────────────────────────────────────────────
/**
 * @param {string} state
 * @param {string} [district]
 */
export async function fetchAvailableMarkets(state, district = '') {
  // Use the yards endpoint to get market yards by state/district
  const params = { state };
  if (district) params.district = district;
  const { data } = await marketAxios.get('/yards', { params });
  // Controller returns { success, data: { yards, total }, meta }
  const yards = data?.data?.yards || []
  // Return an array of yard names (shortName) for dropdowns
  return yards.map(y => y.shortName || y.name || y.yardId);
}

// ─── Get available commodities ─────────────────────────────────────────────────
/**
 * @param {string} state
 * @param {string} market
 */
export async function fetchAvailableCommodities(state, market) {
  // Backend exposes meta endpoint with states & commodities
  const { data } = await marketAxios.get('/meta');
  return data?.data?.commodities || [];
}

// ─── Yard prices (single yard) ─────────────────────────────────────────────
/**
 * @param {string} yardId
 * @param {string} [crop]
 */
export async function fetchYardPrices(yardId, crop = '') {
  const params = { yard: yardId }
  if (crop) params.crop = crop
  const { data } = await marketAxios.get('/yardprices', { params })
  return data
}