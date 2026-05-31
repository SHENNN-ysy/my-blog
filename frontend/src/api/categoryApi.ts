import axiosInstance from './axios'
import type { Category } from '@/types'

export const categoryApi = {
  list() {
    return axiosInstance.get<Category[]>('/categories').then((res) => res.data)
  },
}
