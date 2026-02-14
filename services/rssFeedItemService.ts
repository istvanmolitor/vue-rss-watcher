import axios from 'axios'
import { getBackandUrl } from '@admin/lib/utils'

const api = axios.create({
  baseURL: getBackandUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export interface RssFeed {
  id: number
  name: string
  url: string
  enabled: boolean
}

export interface RssFeedItem {
  id: number
  rss_feed_id: number
  guid: string
  title: string
  link: string
  description: string | null
  image: string | null
  published_at: string | null
  created_at: string
  updated_at: string
  feed?: RssFeed
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters?: {
    feed_id?: number | null
    search?: string
    sort?: string
    direction?: string
  }
}

export interface SingleResponse<T> {
  data: T
}

export const rssFeedItemService = {
  /**
   * Get all RSS feed items
   */
  getAll(params?: { feed_id?: number; search?: string; sort?: string; direction?: string; page?: number; per_page?: number }) {
    return api.get<PaginatedResponse<RssFeedItem>>('/api/rss-watcher/items', { params })
  },

  /**
   * Get RSS feed item by ID
   */
  getById(id: number | string) {
    return api.get<SingleResponse<RssFeedItem>>(`/api/rss-watcher/items/${id}`)
  },

  /**
   * Delete RSS feed item
   */
  delete(id: number | string) {
    return api.delete(`/api/rss-watcher/items/${id}`)
  },
}

