import { Circular } from '../types'

// Use relative path for production (Netlify), absolute URL for development
const API_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:3001')

// Helper function to get auth token
const getAuthHeader = () => {
  const token = localStorage.getItem('smp_auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
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
      ? `${API_URL}/api/circulars?department=${department}`
      : `${API_URL}/api/circulars`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch circulars')
    }

    return response.json()
  },

  getById: async (id: string): Promise<Circular> => {
    const response = await fetch(`${API_URL}/api/circulars/${id}`)

    if (!response.ok) {
      throw new Error('Failed to fetch circular')
    }

    return response.json()
  },

  create: async (circular: Omit<Circular, 'id' | 'created_at'>): Promise<Circular> => {
    const response = await fetch(`${API_URL}/api/circulars`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(circular),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create circular')
    }

    return response.json()
  },

  update: async (id: string, circular: Omit<Circular, 'id' | 'created_at'>): Promise<Circular> => {
    const response = await fetch(`${API_URL}/api/circulars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(circular),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update circular')
    }

    return response.json()
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/api/circulars/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete circular')
    }
  },

  toggleFeatured: async (id: string): Promise<Circular> => {
    const response = await fetch(`${API_URL}/api/circulars/${id}/featured`, {
      method: 'PATCH',
      headers: getAuthHeader(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to toggle featured')
    }

    return response.json()
  },
}
