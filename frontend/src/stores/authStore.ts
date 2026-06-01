import { create } from 'zustand'
import type { User } from '@/types'

interface AuthState {
  token: string | null
  user: User | null
  isLoggedIn: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

const TOKEN_KEY = 'auth-token'
const USER_KEY = 'auth-user'
const REMEMBER_ME_KEY = 'remember-me'

function loadToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getRememberMe(): boolean {
  try {
    return localStorage.getItem(REMEMBER_ME_KEY) === 'true'
  } catch {
    return false
  }
}

export function setRememberMePreference(value: boolean): void {
  try {
    localStorage.setItem(REMEMBER_ME_KEY, String(value))
  } catch {
    // ignore storage errors
  }
}

const initialToken = loadToken()
const initialUser = loadUser()

export const useAuthStore = create<AuthState>()((set) => ({
  token: initialToken,
  user: initialUser,
  isLoggedIn: !!initialToken,

  setAuth: (token, user) => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch {
      // ignore storage errors
    }
    set({ token, user, isLoggedIn: true })
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {
      // ignore storage errors
    }
    set({ token: null, user: null, isLoggedIn: false })
  },
}))
