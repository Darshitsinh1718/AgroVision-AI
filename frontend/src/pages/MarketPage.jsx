// frontend/src/pages/MarketPage.jsx
// Live Mandi Prices page for AgroVision AI
// Shows real-time Agmarknet data with fallback support

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchNearestMarketPrices,
  fetchMandiPrices,
  fetchAvailableMarkets,
  fetchYardPrices,
} from '../services/marketApi.js';

// ─── Mock user profile (replace with your auth context / user hook) ────────────
// In your real app: const userProfile = useAuth().user?.profile or similar
const DEFAULT_USER_PROFILE = {
  state: 'Gujarat',
  district: 'Gir Somnath',
  taluka: 'Kodinar',
};

// ─── Commodity emoji map ───────────────────────────────────────────────────────
const COMMODITY_EMOJI = {
  groundnut: '🥜',
  cotton: '🌿',
  wheat: '🌾',
  onion: '🧅',
  cumin: '🌱',
  bajra: '🌾',
  potato: '🥔',
  fennel: '🌿',
  maize: '🌽',
  garlic: '🧄',
  tomato: '🍅',
  default: '🌿',
};

function getCommodityEmoji(name = '') {
  const key = name.toLowerCase();
  for (const [k, v] of Object.entries(COMMODITY_EMOJI)) {
    if (key.includes(k)) return v;
  }
  return COMMODITY_EMOJI.default;
}

// ─── Gujarat districts list ────────────────────────────────────────────────────
const GUJARAT_DISTRICTS = [
  'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch',
  'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhoomi Dwarka',
  'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kachchh', 'Kheda',
  'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal',
  'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar',
  'Tapi', 'Vadodara', 'Valsad',
];

// ─── Common Gujarat commodities ────────────────────────────────────────────────
const QUICK_CROPS = [
  'Groundnut', 'Cotton', 'Wheat', 'Onion', 'Cumin', 'Bajra',
  'Potato', 'Fennel', 'Maize', 'Garlic', 'Tomato', 'Rice',
];

// ─── Price card component ──────────────────────────────────────────────────────
function PriceCard({ record }) {
  const emoji = getCommodityEmoji(record.commodity);
  const modal = parseInt(record.modalPrice || record.modal_price || 0, 10).toLocaleString('en-IN');
  const min = parseInt(record.minPrice || record.min_price || 0, 10).toLocaleString('en-IN');
  const max = parseInt(record.maxPrice || record.max_price || 0, 10).toLocaleString('en-IN');

  return (
    <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      {/* Top color strip */}
      <div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500" />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <div>
              <h3 className="font-bold text-stone-100 text-sm leading-tight">
                {record.commodity}
              </h3>
              {record.variety && (
                <p className="text-xs text-stone-400">{record.variety}</p>
              )}
            </div>
          </div>
          {record.grade && (
            <span className="text-xs bg-amber-900/30 text-amber-300 border border-amber-800 rounded-full px-2 py-0.5 font-medium">
              {record.grade}
            </span>
          )}
        </div>

        {/* Modal Price — big */}
        <div className="bg-white/[0.02] rounded-xl p-3 mb-3 text-center">
          <p className="text-xs text-emerald-300 font-medium mb-0.5">Modal Price</p>
          <p className="text-2xl font-black text-emerald-200">
            ₹{modal}
          </p>
          <p className="text-xs text-emerald-300">per quintal</p>
        </div>

        {/* Min / Max */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-white/[0.02] rounded-lg p-2 text-center">
            <p className="text-xs text-sky-300 font-medium">Min</p>
            <p className="text-sm font-bold text-sky-200">₹{min}</p>
          </div>
          <div className="bg-white/[0.02] rounded-lg p-2 text-center">
            <p className="text-xs text-rose-300 font-medium">Max</p>
            <p className="text-sm font-bold text-rose-200">₹{max}</p>
          </div>
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-white/[0.04]">
          <span>📍 {record.market || record.yardName || record.yard}</span>
          <span>📅 {record.date || record.arrival_date}</span>
        </div>
        <p className="text-xs text-stone-400 mt-1">
          {record.district}, {record.state}
        </p>
      </div>
    </div>
  );
}

// ─── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ isLive, fromCache }) {
  if (isLive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-900/30 text-emerald-200 border border-emerald-800">
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/[0.03] text-emerald-300 border border-white/[0.04]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        LIVE DATA {fromCache ? '(cached)' : ''}
      </span>
    </span>
  );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-900/30 text-amber-200 border border-amber-800">
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/[0.03] text-amber-300 border border-white/[0.04]">
      <span className="text-amber-400">⚠️</span>
      DEMO / FALLBACK DATA
    </span>
  </span>
  );

}

// ─── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white/[0.03] rounded-2xl border border-white/[0.04] p-4 animate-pulse">
      <div className="h-1 bg-white/[0.04] rounded mb-4" />
      <div className="flex gap-2 mb-3">
        <div className="w-8 h-8 bg-white/[0.04] rounded-lg" />
        <div className="flex-1">
          <div className="h-3 bg-white/[0.04] rounded w-3/4 mb-1" />
          <div className="h-2 bg-white/[0.03] rounded w-1/2" />
        </div>
      </div>
      <div className="h-16 bg-white/[0.03] rounded-xl mb-3" />
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="h-10 bg-white/[0.03] rounded-lg" />
        <div className="h-10 bg-white/[0.03] rounded-lg" />
      </div>
      <div className="h-2 bg-white/[0.03] rounded mt-2" />
    </div>
  );
}

// ─── Main MarketPage ───────────────────────────────────────────────────────────
export default function MarketPage() {
  // Replace with your actual user profile from context/hook
  const userProfile = DEFAULT_USER_PROFILE;

  const [records, setRecords] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [fromCache, setFromCache] = useState(false);
  const [nearestMarket, setNearestMarket] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [selectedState, setSelectedState] = useState(userProfile.state || 'Gujarat');
  const [selectedDistrict, setSelectedDistrict] = useState(userProfile.district || '');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [searchText, setSearchText] = useState('');

  // Markets dropdown
  const [availableMarkets, setAvailableMarkets] = useState([]);
  const [loadingMarkets, setLoadingMarkets] = useState(false);

  // Mode: 'nearest' | 'filtered'
  const [mode, setMode] = useState('nearest');

  const searchRef = useRef(null);

  // ── Load nearest market on mount ───────────────────────────────────────────
  const loadNearest = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // Get nearest yards, then fetch prices for the nearest yard
      const nearestRes = await fetchNearestMarketPrices(userProfile, selectedCommodity || undefined);
      const payload = nearestRes?.data || {};
      const nearestYard = payload.nearestYard || (payload.yards && payload.yards[0]);
      if (nearestYard) {
        const yardPricesRes = await fetchYardPrices(nearestYard.yardId || nearestYard.yard || nearestYard.shortName, selectedCommodity || undefined);
        const yardData = yardPricesRes?.data || {};
        setRecords(yardData.prices || []);
        setNearestMarket(nearestYard.name || nearestYard.shortName || nearestYard.yardId || '');
        setIsLive(false);
        setFromCache(false);
      } else {
        setRecords([]);
      }
    } catch (err) {
      setError('Failed to load market prices. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [userProfile.state, userProfile.district, userProfile.taluka, selectedCommodity]);

  // ── Load filtered prices ───────────────────────────────────────────────────
  const loadFiltered = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchMandiPrices({
        state: selectedState,
        district: selectedDistrict || undefined,
        market: selectedMarket || undefined,
        commodity: selectedCommodity || undefined,
        limit: 200,
      });
      const payload = res?.data || {};
      setRecords(payload.records || []);
      // backend returns `source` and `isMock` in payload
      setIsLive(payload.source === 'data.gov.in');
      setFromCache(!!payload.isMock);
    } catch (err) {
      setError('Failed to load market prices. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedDistrict, selectedMarket, selectedCommodity]);

  // ── Load markets list when district changes ────────────────────────────────
  useEffect(() => {
    if (!selectedState) return;
    setLoadingMarkets(true);
    fetchAvailableMarkets(selectedState, selectedDistrict)
      .then((markets) => setAvailableMarkets(markets))
      .catch(() => setAvailableMarkets([]))
      .finally(() => setLoadingMarkets(false));
  }, [selectedState, selectedDistrict]);

  // ── Fetch on mode / filter change ─────────────────────────────────────────
  useEffect(() => {
    if (mode === 'nearest') {
      loadNearest();
    } else {
      loadFiltered();
    }
  }, [mode, loadNearest, loadFiltered]);

  // ── Filter records by search text ─────────────────────────────────────────
  const filteredRecords = records.filter((r) => {
    if (!searchText.trim()) return true;
    const q = searchText.toLowerCase();
    return (
      r.commodity?.toLowerCase().includes(q) ||
      r.market?.toLowerCase().includes(q) ||
      r.variety?.toLowerCase().includes(q) ||
      r.district?.toLowerCase().includes(q)
    );
  });

  // ── Quick crop pill click ──────────────────────────────────────────────────
  function handleCropPill(crop) {
    setSelectedCommodity(crop === selectedCommodity ? '' : crop);
    setMode('filtered');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-slate-900 to-stone-800 text-stone-200">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-transparent border-b border-white/[0.06] sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl font-black text-stone-100 flex items-center gap-2">
                <span className="text-2xl">🏪</span>
                Mandi Prices
              </h1>
              <p className="text-xs text-stone-400 mt-0.5">
                Live Agmarknet data · data.gov.in
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge isLive={isLive} fromCache={fromCache} />
              <button
                onClick={() => mode === 'nearest' ? loadNearest() : loadFiltered()}
                disabled={loading}
                className="p-2 rounded-xl bg-white/[0.04] text-stone-200 hover:bg-white/[0.06] transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-5">

        {/* ── Location banner ──────────────────────────────────────────────── */}
        {mode === 'nearest' && nearestMarket && (
          <div className="bg-gradient-to-r from-emerald-900 to-green-900 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">
                  📍 Auto-detected Nearest Market
                </p>
                <h2 className="text-xl font-black mt-1">
                  {nearestMarket} Market Yard
                </h2>
                <p className="text-emerald-200 text-sm mt-0.5">
                  {userProfile.district}, {userProfile.state}
                </p>
              </div>
              <button
                onClick={() => setMode('filtered')}
                className="text-xs bg-white/20 hover:bg-white/30 rounded-xl px-3 py-2 font-semibold transition-colors"
              >
                Browse Other Markets →
              </button>
            </div>
          </div>
        )}

        {/* ── Mode toggle ──────────────────────────────────────────────────── */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('nearest')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === 'nearest'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white/[0.04] text-stone-300 border border-white/[0.06] hover:border-emerald-600'
            }`}
          >
            📍 My Market ({userProfile.district})
          </button>
          <button
            onClick={() => setMode('filtered')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
              mode === 'filtered'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white/[0.04] text-stone-300 border border-white/[0.06] hover:border-emerald-600'
            }`}
          >
            🔍 Browse All Markets
          </button>
        </div>

        {/* ── Filters (visible in filtered mode) ───────────────────────────── */}
        {mode === 'filtered' && (
          <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-stone-100">🎯 Filter Markets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* State */}
              <div>
                <label className="text-xs font-semibold text-stone-400 block mb-1">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict('');
                    setSelectedMarket('');
                  }}
                  className="w-full text-sm border border-white/[0.06] rounded-xl px-3 py-2 bg-white/[0.02] text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
                >
                  <option value="Gujarat">Gujarat</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              {/* District */}
              <div>
                <label className="text-xs font-semibold text-stone-400 block mb-1">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedMarket('');
                  }}
                  className="w-full text-sm border border-white/[0.06] rounded-xl px-3 py-2 bg-white/[0.02] text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
                >
                  <option value="">All Districts</option>
                  {selectedState === 'Gujarat'
                    ? GUJARAT_DISTRICTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))
                    : null}
                </select>
              </div>

              {/* Market yard */}
              <div>
                <label className="text-xs font-semibold text-stone-400 block mb-1">
                  Market Yard {loadingMarkets && '…'}
                </label>
                <select
                  value={selectedMarket}
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className="w-full text-sm border border-white/[0.06] rounded-xl px-3 py-2 bg-white/[0.02] text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
                >
                  <option value="">All Markets</option>
                  {availableMarkets.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Commodity */}
              <div>
                <label className="text-xs font-semibold text-stone-400 block mb-1">Commodity</label>
                <select
                  value={selectedCommodity}
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                  className="w-full text-sm border border-white/[0.06] rounded-xl px-3 py-2 bg-white/[0.02] text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-700/40"
                >
                  <option value="">All Commodities</option>
                  {QUICK_CROPS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ── Quick crop pills ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-stone-400 self-center">Quick filter:</span>
          {QUICK_CROPS.map((crop) => (
            <button
              key={crop}
              onClick={() => handleCropPill(crop)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all border ${
                selectedCommodity === crop
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
                    : 'bg-white/[0.03] text-stone-300 border-white/[0.06] hover:border-emerald-600 hover:text-emerald-300'
              }`}
            >
              {getCommodityEmoji(crop)} {crop}
            </button>
          ))}
          {selectedCommodity && (
            <button
              onClick={() => setSelectedCommodity('')}
              className="text-xs px-3 py-1.5 rounded-full font-semibold bg-red-900/40 text-red-300 border border-red-800 hover:bg-red-900/50 transition-all"
            >
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Search ───────────────────────────────────────────────────────── */}
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search crops, markets, varieties…"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-sm text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-700/40 shadow-sm"
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
            >
              ✕
            </button>
          )}
        </div>

        {/* ── Error ────────────────────────────────────────────────────────── */}
        {error && (
          <div className="bg-red-900/50 border border-red-800 text-red-200 rounded-2xl p-4 text-sm flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* ── Results header ────────────────────────────────────────────────── */}
        {!loading && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-stone-400 font-medium">
              {filteredRecords.length} {filteredRecords.length === 1 ? 'result' : 'results'}
              {searchText && ` for "${searchText}"`}
            </p>
            {!isLive && (
              <p className="text-xs text-amber-300 bg-amber-900/30 border border-amber-800 px-2 py-1 rounded-lg">
                ⚠️ Showing sample prices — configure API key for live data
              </p>
            )}
          </div>
        )}

        {/* ── Price grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredRecords.length > 0
            ? filteredRecords.map((record, idx) => (
                <PriceCard key={`${record.market}-${record.commodity}-${idx}`} record={record} />
              ))
            : (
              <div className="col-span-full text-center py-16">
                <div className="text-5xl mb-4">🌾</div>
                <p className="text-stone-400 font-medium">No price data found</p>
                <p className="text-stone-500 text-sm mt-1">
                  Try different filters or{' '}
                  <button onClick={() => { setSelectedCommodity(''); setSearchText(''); }} className="text-emerald-300 underline">
                    clear filters
                  </button>
                </p>
              </div>
            )}
        </div>

        {/* ── Info footer ──────────────────────────────────────────────────── */}
        <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-4 text-xs text-stone-400 space-y-1">
          <p className="font-semibold text-stone-300">📊 Data Source</p>
          <p>Prices from Agmarknet via data.gov.in (Resource ID: 9ef84268-d588-465a-a308-a864a43d0070)</p>
          <p>Prices are in ₹ per quintal (100 kg). Data refreshes every 30 minutes.</p>
          <p>For trading decisions, verify prices directly with your local mandi office.</p>
        </div>
      </div>
    </div>
  );
}