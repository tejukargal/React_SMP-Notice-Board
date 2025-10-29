import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Circular } from '../types'
import { circularsAPI } from '../api/client'

interface CircularsContextType {
  circulars: Circular[]
  loading: boolean
  error: string
  fetchCirculars: (force?: boolean) => Promise<void>
  updateCircular: (id: string, circular: Circular) => void
  deleteCircular: (id: string) => void
  addCircular: (circular: Circular) => void
}

const CircularsContext = createContext<CircularsContextType | undefined>(undefined)

export const useCirculars = () => {
  const context = useContext(CircularsContext)
  if (!context) {
    throw new Error('useCirculars must be used within CircularsProvider')
  }
  return context
}

interface CircularsProviderProps {
  children: ReactNode
}

export const CircularsProvider = ({ children }: CircularsProviderProps) => {
  const [circulars, setCirculars] = useState<Circular[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [lastFetch, setLastFetch] = useState<number>(0)

  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000

  const fetchCirculars = useCallback(async (force = false) => {
    const now = Date.now()

    // Return cached data if it's still fresh and not forced
    if (!force && circulars.length > 0 && (now - lastFetch) < CACHE_DURATION) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const data = await circularsAPI.getAll()
      setCirculars(data)
      setLastFetch(now)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch circulars')
    } finally {
      setLoading(false)
    }
  }, [circulars.length, lastFetch])

  const updateCircular = useCallback((id: string, updatedCircular: Circular) => {
    setCirculars(prev =>
      prev.map(c => c.id === id ? updatedCircular : c)
    )
  }, [])

  const deleteCircular = useCallback((id: string) => {
    setCirculars(prev => prev.filter(c => c.id !== id))
  }, [])

  const addCircular = useCallback((newCircular: Circular) => {
    setCirculars(prev => [newCircular, ...prev])
  }, [])

  return (
    <CircularsContext.Provider
      value={{
        circulars,
        loading,
        error,
        fetchCirculars,
        updateCircular,
        deleteCircular,
        addCircular,
      }}
    >
      {children}
    </CircularsContext.Provider>
  )
}
