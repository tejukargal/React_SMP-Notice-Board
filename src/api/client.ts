import { Circular } from '../types'

// Use relative path for production (Netlify), absolute URL for development
// This function evaluates at runtime, not build time
const getAPIURL = (): string => {
  // Check if running on Netlify first (before checking env var)
  if (typeof window !== 'undefined' && window.location.hostname.includes('netlify.app')) {
    return '' // Use relative URLs on Netlify
  }

  // Use env var for development override
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }

  return 'http://localhost:3001' // Development default
}

// Helper function to get auth token
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('smp_auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function to handle authentication errors
const handleAuthError = (response: Response) => {
  if (response.status === 401 || response.status === 403) {
    // Token is invalid or expired, clear it and redirect to login
    localStorage.removeItem('smp_auth_token')
    localStorage.removeItem('smp_auth_user')
    window.location.href = '/login?error=session_expired'
  }
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${getAPIURL()}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Login failed')
    }

    return response.json()
  },
}

// Circulars API
export const circularsAPI = {
  getAll: async (department?: string): Promise<Circular[]> => {
    const url = department
      ? `${getAPIURL()}/api/circulars?department=${department}`
      : `${getAPIURL()}/api/circulars`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch circulars')
    }

    return response.json()
  },

  getById: async (id: string): Promise<Circular> => {
    const response = await fetch(`${getAPIURL()}/api/circulars/${id}`)

    if (!response.ok) {
      throw new Error('Failed to fetch circular')
    }

    return response.json()
  },

  create: async (circular: Omit<Circular, 'id' | 'created_at'>): Promise<Circular> => {
    const response = await fetch(`${getAPIURL()}/api/circulars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(circular),
    })

    if (!response.ok) {
      handleAuthError(response)
      const error = await response.json()
      throw new Error(error.error || 'Failed to create circular')
    }

    return response.json()
  },

  update: async (id: string, circular: Omit<Circular, 'id' | 'created_at'>): Promise<Circular> => {
    const response = await fetch(`${getAPIURL()}/api/circulars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(circular),
    })

    if (!response.ok) {
      handleAuthError(response)
      const error = await response.json()
      throw new Error(error.error || 'Failed to update circular')
    }

    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${getAPIURL()}/api/circulars/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      handleAuthError(response)
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete circular')
    }
  },

  toggleFeatured: async (id: string): Promise<Circular> => {
    const response = await fetch(`${getAPIURL()}/api/circulars/${id}/featured`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      handleAuthError(response)
      const error = await response.json()
      throw new Error(error.error || 'Failed to toggle featured')
    }

    return response.json()
  },
}
