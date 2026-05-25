// src/services/recommendApi.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export async function getRecommendations(profile = {}, topN = 5) {
  const res = await fetch(`${API_BASE}/recommend?topN=${topN}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch recommendations')
  return data
}

export default { getRecommendations }
