export interface User {
  id: number
  username: string
  nickname: string
  email: string
  avatar?: string
  role: string
  createTime?: string
}

export interface LoginDTO {
  username: string
  password: string
}

export interface RegisterDTO {
  username: string
  password: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Article {
  id: number
  title: string
  summary: string
  content?: string
  coverIcon?: string
  category: string
  categoryName?: string
  tags: string[]
  status: 'done' | 'wip' | 'plan'
  statusText?: string
  viewCount: number
  commentCount: number
  createTime: string
  updateTime?: string
}

export interface Note {
  id: number
  title: string
  excerpt: string
  category: string
  categoryName?: string
  tags: string[]
  date: string
  isFeatured?: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  count: number
}
export interface Comment {
  id: number
  articleId: number
  userId: number
  username: string
  avatar?: string
  content: string
  createTime: string
  parentId?: number
  replies?: Comment[]
}

export interface PageResult<T> {
  records: T[]
  total: number
  current: number
  size: number
  pages: number
}
