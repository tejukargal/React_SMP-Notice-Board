import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { isAuthenticated, getAuthUser, setAuthToken, setAuthUser, removeAuthToken } from '../utils/auth'
import { authAPI } from '../api/client'

interface AuthContextType {
  isAuth: boolean
  username: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuth, setIsAuth] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      if (isAuthenticated()) {
        setIsAuth(true)
        setUsername(getAuthUser())
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (user: string, password: string) => {
    try {
      const response = await authAPI.login(user, password)
      setAuthToken(response.token)
      setAuthUser(response.username)
      setIsAuth(true)
      setUsername(response.username)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    removeAuthToken()
    setIsAuth(false)
    setUsername(null)
  }

  return (
    <AuthContext.Provider value={{ isAuth, username, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
