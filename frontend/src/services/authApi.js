const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(
      data.message ||
      data.error ||
      data.data?.message ||
      'Something went wrong'
    )
  }

  return data
}

const findTokenDeep = (obj) => {
  if (!obj || typeof obj !== 'object') return null

  if (obj.token) return obj.token
  if (obj.accessToken) return obj.accessToken
  if (obj.jwt) return obj.jwt

  for (const key of Object.keys(obj)) {
    const found = findTokenDeep(obj[key])
    if (found) return found
  }

  return null
}

const findUserDeep = (obj) => {
  if (!obj || typeof obj !== 'object') return null

  if (obj.user && typeof obj.user === 'object') return obj.user

  for (const key of Object.keys(obj)) {
    const found = findUserDeep(obj[key])
    if (found) return found
  }

  return null
}

const extractAuthData = (res) => {
  const token = findTokenDeep(res)
  const user = findUserDeep(res)

  return {
    token,
    user,
    raw: res,
  }
}

export const authApi = {
  register: async (formData) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await handleResponse(res)
    return extractAuthData(data)
  },

  login: async ({ email, password }) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await handleResponse(res)
    return extractAuthData(data)
  },

  getMe: async (token) => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await handleResponse(res)

    const user = findUserDeep(data)

    return user || data.data || data
  },

  logout: async (token) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      return await handleResponse(res)
    } finally {
      localStorage.removeItem('agrovision_token')
      localStorage.removeItem('agrovision_user')
      localStorage.removeItem('agrovision_farm_profile')
    }
  },
}