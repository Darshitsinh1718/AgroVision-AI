// frontend/src/hooks/useWeather.js
// ─────────────────────────────────────────────────────────
// Custom hook that manages all weather state:
//   • location (from GPS, localStorage, or default)
//   • weather bundle (current, daily, hourly, farming)
//   • loading states (initial + refresh)
//   • error handling
//   • auto-refresh every 10 minutes
// ─────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchWeather, searchCity, DEFAULT_LOCATION } from '../services/weatherApi.js'

const LOCATION_KEY   = 'agrovision_weather_location'
const REFRESH_MS     = 10 * 60 * 1000  // 10 minutes

function loadSavedLocation() {
  try {
    const raw = localStorage.getItem(LOCATION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveLocation(loc) {
  try { localStorage.setItem(LOCATION_KEY, JSON.stringify(loc)) } catch {}
}

export function useWeather() {
  const [location, setLocation]   = useState(loadSavedLocation() || DEFAULT_LOCATION)
  const [weather,  setWeather]    = useState(null)
  const [loading,  setLoading]    = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error,    setError]      = useState(null)
  const [gpsLoading, setGpsLoading] = useState(false)
  const intervalRef = useRef(null)

  // ── Fetch weather for current location ──────────────────
  const load = useCallback(async (loc = location, isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true)
      setError(null)
      const data = await fetchWeather(loc.lat, loc.lon)
      setWeather(data)
    } catch (err) {
      setError(err.message || 'Failed to load weather data')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [location])

  // ── Auto-load on mount + location change ─────────────────
  useEffect(() => {
    load(location)

    // Auto-refresh every 10 minutes
    intervalRef.current = setInterval(() => load(location, true), REFRESH_MS)
    return () => clearInterval(intervalRef.current)
  }, [location.lat, location.lon])

  // ── Change location ──────────────────────────────────────
  const changeLocation = useCallback((newLoc) => {
    saveLocation(newLoc)
    setLocation(newLoc)
  }, [])

  // ── GPS detect ───────────────────────────────────────────
  const detectGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser')
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const loc = {
          name:    'My Location',
          state:   '',
          country: '',
          lat:     pos.coords.latitude,
          lon:     pos.coords.longitude,
        }
        setGpsLoading(false)
        changeLocation(loc)
      },
      (err) => {
        setGpsLoading(false)
        setError('Could not get your location. Please search manually.')
      },
      { timeout: 10000 }
    )
  }, [changeLocation])

  // ── Manual refresh ───────────────────────────────────────
  const refresh = useCallback(() => load(location, true), [location, load])

  return {
    location,
    weather,
    loading,
    refreshing,
    error,
    gpsLoading,
    changeLocation,
    detectGPS,
    refresh,
  }
}
