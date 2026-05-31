import axiosInstance from './axios'
import type { Article, PageResult } from '@/types'

export interface ArticleQuery {
  category?: string
  tag?: string
  page?: number
  size?: number
}

export const articleApi = {
  list(params: ArticleQuery = {}) {
    return axiosInstance
      .get<PageResult<Article>>('/articles', { params })
      .then((res) => res.data)
  },
  getById(id: number) {
    return axiosInstance.get<Article>(`/articles/${id}`).then((res) => res.data)
  },
}
