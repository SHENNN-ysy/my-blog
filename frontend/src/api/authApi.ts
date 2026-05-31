import axiosInstance from './axios'
import type { LoginDTO, RegisterDTO, AuthResponse } from '@/types'

export const authApi = {
  login(data: LoginDTO) {
    return axiosInstance.post<AuthResponse>('/auth/login', data).then((res) => res.data)
  },
  register(data: RegisterDTO) {
    return axiosInstance.post<AuthResponse>('/auth/register', data).then((res) => res.data)
  },
  getCurrentUser() {
    return axiosInstance.get<AuthResponse>('/auth/current').then((res) => res.data)
  },
}
