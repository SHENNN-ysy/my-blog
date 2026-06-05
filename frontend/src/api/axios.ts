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
  (response: AxiosResponse) => {
    const payload = response.data?.data
    response.data = payload
    return response
  },
  (error) => {
    const status = error.response?.status
    const requestUrl = error.config?.url ?? ''
    const isLoginRequest = requestUrl.includes('/auth/login')
    const isExploreRoute = window.location.pathname === '/explore'

    if (status === 401 && !isLoginRequest) {
      useAuthStore.getState().clearAuth()
      if (!isExploreRoute) {
        window.location.href = '/explore'
      }
    }
    const result = error.response?.data
    return Promise.reject(
      result
        ? { code: result.code, message: result.message }
        : { code: -1, message: error.message || '网络异常，请检查后端服务是否启动' },
    )
  },
)

export default instance
