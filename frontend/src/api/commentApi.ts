import axiosInstance from './axios'
import type { Comment } from '@/types'

export interface CommentDTO {
  articleId: number
  content: string
  parentId?: number
}

export const commentApi = {
  listByArticle(articleId: number) {
    return axiosInstance
      .get<Comment[]>(`/comments/article/${articleId}`)
      .then((res) => res.data)
  },
  submit(data: CommentDTO) {
    return axiosInstance.post<Comment>('/comments', data).then((res) => res.data)
  },
}
