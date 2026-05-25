import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/authApi.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  const saveAuth = (tokenVal, userVal) => {
    if (!tokenVal) return

    setToken(tokenVal)
    setUser(userVal || null)

    localStorage.setItem('agrovision_token', tokenVal)
    localStorage.setItem('agrovision_user', JSON.stringify(userVal || null))
  }

  const updateUser = (updatedFields) => {
    setUser(prev => {
      const updatedUser = {
        ...(prev || {}),
        ...(updatedFields || {}),
      }

      localStorage.setItem('agrovision_user', JSON.stringify(updatedUser))
      localStorage.setItem('agrovision_farm_profile', JSON.stringify(updatedUser))

      return updatedUser
    })
  }

  const clearAuth = () => {
    setToken(null)
    setUser(null)

    localStorage.removeItem('agrovision_token')
    localStorage.removeItem('agrovision_user')
    localStorage.removeItem('agrovision_farm_profile')
  }

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('agrovision_token')
      const storedUser = localStorage.getItem('agrovision_user')
      const storedFarmProfile = localStorage.getItem('agrovision_farm_profile')

      if (!storedToken) {
        setLoading(false)
        return
      }

      setToken(storedToken)

      let parsedUser = null
      let parsedFarmProfile = null

      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser)
        } catch {
          localStorage.removeItem('agrovision_user')
        }
      }

      if (storedFarmProfile) {
        try {
          parsedFarmProfile = JSON.parse(storedFarmProfile)
        } catch {
          localStorage.removeItem('agrovision_farm_profile')
        }
      }

      if (parsedUser || parsedFarmProfile) {
        setUser({
          ...(parsedUser || {}),
          ...(parsedFarmProfile || {}),
        })
      }

      try {
        const currentUser = await authApi.getMe(storedToken)

        const mergedUser = {
          ...(currentUser || {}),
          ...(parsedFarmProfile || {}),
        }

        setUser(mergedUser)
        localStorage.setItem('agrovision_user', JSON.stringify(mergedUser))
      } catch {
        clearAuth()
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    const data = await authApi.login(credentials)

    if (!data.token) {
      throw new Error('Login successful but token not found')
    }

    saveAuth(data.token, data.user)

    return data
  }

  const register = async (formData) => {
    const data = await authApi.register(formData)

    if (!data.token) {
      throw new Error('Registration successful but token not found')
    }

    saveAuth(data.token, data.user)

    return data
  }

  const logout = useCallback(async () => {
    try {
      const storedToken = token || localStorage.getItem('agrovision_token')

      if (storedToken) {
        await authApi.logout(storedToken)
      }
    } catch {
      // ignore logout API error
    } finally {
      clearAuth()
    }
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)

  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }

  return ctx
}