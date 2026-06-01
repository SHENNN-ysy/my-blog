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
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    if (status === 401 && !isLoginRequest) {
      useAuthStore.getState().clearAuth()
      window.location.href = '/explore'
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
