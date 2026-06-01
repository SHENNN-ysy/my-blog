import axios from 'axios'

const request = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

request.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const isLoginRequest = error.config?.url?.includes('/auth/login')
    if (status === 401 && !isLoginRequest) {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  },
)

export default request
