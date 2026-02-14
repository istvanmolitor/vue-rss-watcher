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
  last_fetched_at: string | null
  created_at: string
  updated_at: string
  items_count?: number
}

export interface RssFeedFormData {
  name: string
  url: string
  enabled?: boolean
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
    search?: string
    sort?: string
    direction?: string
  }
}

export interface SingleResponse<T> {
  data: T
}

export const rssFeedService = {
  /**
   * Get all RSS feeds
   */
  getAll(params?: { search?: string; sort?: string; direction?: string; page?: number; per_page?: number }) {
    return api.get<PaginatedResponse<RssFeed>>('/api/rss-watcher/feeds', { params })
  },

  /**
   * Get RSS feed by ID
   */
  getById(id: number | string) {
    return api.get<SingleResponse<RssFeed>>(`/api/rss-watcher/feeds/${id}`)
  },

  /**
   * Create a new RSS feed
   */
  create(feed: RssFeedFormData) {
    return api.post<SingleResponse<RssFeed>>('/api/rss-watcher/feeds', feed)
  },

  /**
   * Update RSS feed
   */
  update(id: number | string, feed: RssFeedFormData) {
    return api.put<SingleResponse<RssFeed>>(`/api/rss-watcher/feeds/${id}`, feed)
  },

  /**
   * Delete RSS feed
   */
  delete(id: number | string) {
    return api.delete(`/api/rss-watcher/feeds/${id}`)
  },
}

