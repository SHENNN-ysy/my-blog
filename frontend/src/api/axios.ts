import axios, { type AxiosInstance, type AxiosResponse } from 'axios'
import { useAuthStore } from '@/stores/authStore'

export interface ApiError {
  code: number
  message: string
}

const instance: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

instance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/explore'
    }
    const result = error.response?.data
    return Promise.reject(
      result ? { code: result.code, message: result.message } : error,
    )
  },
)

export default instance
