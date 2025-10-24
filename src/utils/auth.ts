const AUTH_TOKEN_KEY = 'smp_auth_token'
const AUTH_USER_KEY = 'smp_auth_user'

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY)
}

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY)
  localStorage.removeItem(AUTH_USER_KEY)
}

export const setAuthUser = (username: string) => {
  localStorage.setItem(AUTH_USER_KEY, username)
}

export const getAuthUser = (): string | null => {
  return localStorage.getItem(AUTH_USER_KEY)
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

// Simple password validation - in production use bcrypt
export const hashPassword = (password: string): string => {
  // For demo purposes - in production, hash on backend with bcrypt
  return btoa(password)
}

export const verifyPassword = (password: string, hash: string): boolean => {
  // For demo purposes - in production, verify on backend with bcrypt
  return btoa(password) === hash
}
