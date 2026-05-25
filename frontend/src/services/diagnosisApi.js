// frontend/src/services/diagnosisApi.js
// ─────────────────────────────────────────────────────────
// Diagnosis API client with progress tracking and error handling.
// All calls go through your Express backend.
// ─────────────────────────────────────────────────────────
 
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
 
// ── Upload image and run diagnosis ────────────────────────
export async function runDiagnosis(file, cropType = '', fieldName = '', onProgress) {
  const formData = new FormData()
  formData.append('image', file)
  if (cropType)  formData.append('cropType', cropType)
  if (fieldName) formData.append('fieldName', fieldName)
 
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
 
    // Progress tracking
    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 50)) // upload = 0–50%
      }
    })
 
    xhr.addEventListener('load', () => {
      if (onProgress) onProgress(100)
      try {
        const data = JSON.parse(xhr.responseText)
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(data)
        } else {
          reject(new Error(data.message || `Server error ${xhr.status}`))
        }
      } catch {
        reject(new Error('Invalid response from server'))
      }
    })
 
    xhr.addEventListener('error', () => reject(new Error('Network error — check your connection')))
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))
    xhr.addEventListener('timeout', () => reject(new Error('Request timed out — try a smaller image')))
 
    xhr.open('POST', `${API_BASE}/diagnosis`)
    xhr.timeout = 60000  // 60s timeout for AI inference
    xhr.send(formData)
  })
}
 
// ── Get scan history ──────────────────────────────────────
export async function getScanHistory(params = {}) {
  const query = new URLSearchParams({
    page:  params.page  || 1,
    limit: params.limit || 10,
    ...(params.cropType && { cropType: params.cropType }),
    ...(params.status   && { status:   params.status   }),
  })
  const res  = await fetch(`${API_BASE}/diagnosis?${query}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch history')
  return data
}
 
// ── Get diagnosis stats ───────────────────────────────────
export async function getDiagnosisStats() {
  const res  = await fetch(`${API_BASE}/diagnosis/stats`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch stats')
  return data
}
 
// ── Delete a scan ─────────────────────────────────────────
export async function deleteScan(id) {
  const res = await fetch(`${API_BASE}/diagnosis/${id}`, { method: 'DELETE' })
  if (res.status !== 204 && !res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.message || 'Failed to delete scan')
  }
}
 
// ── Severity colours ──────────────────────────────────────
export const SEVERITY_CONFIG = {
  none:     { label: 'Healthy',  color: 'leaf',    bg: 'bg-leaf-950',    border: 'border-leaf-700/40',    text: 'text-leaf-400',    icon: '✅' },
  low:      { label: 'Low',      color: 'sky',     bg: 'bg-sky-950',     border: 'border-sky-700/40',     text: 'text-sky-400',     icon: '🟡' },
  moderate: { label: 'Moderate', color: 'harvest', bg: 'bg-harvest-950', border: 'border-harvest-700/40', text: 'text-harvest-400', icon: '🟠' },
  high:     { label: 'High',     color: 'red',     bg: 'bg-red-950',     border: 'border-red-700/40',     text: 'text-red-400',     icon: '🔴' },
  critical: { label: 'Critical', color: 'red',     bg: 'bg-red-950/70',  border: 'border-red-600/60',     text: 'text-red-300',     icon: '🚨' },
}
 
export const TREATMENT_ICONS = {
  chemical: '🧪', organic: '🌿', cultural: '🌾', biological: '🦠',
}