import { create } from 'zustand'

interface User {
  id: number
  username: string
  nickname: string
  role: string
  avatar?: string
}

interface AdminState {
  token: string | null
  user: User | null
  isLoggedIn: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

const TOKEN_KEY = 'admin_token'
const USER_KEY = 'admin_user'

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

const initialToken = loadToken()
const initialUser = loadUser()

export const useAdminStore = create<AdminState>()((set) => ({
  token: initialToken,
  user: initialUser,
  isLoggedIn: !!initialToken,

  setAuth: (token, user) => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } catch {
      // ignore
    }
    set({ token, user, isLoggedIn: true })
  },

  clearAuth: () => {
    try {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
    } catch {
      // ignore
    }
    set({ token: null, user: null, isLoggedIn: false })
  },
}))
