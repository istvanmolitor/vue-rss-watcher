import { ref, computed } from 'vue'
import { rssFeedService, type RssFeed, type RssFeedFormData } from '../services/rssFeedService'

export function useRssFeeds() {
  const feeds = ref<RssFeed[]>([])
  const currentFeed = ref<RssFeed | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Pagination
  const currentPage = ref(1)
  const lastPage = ref(1)
  const perPage = ref(15)
  const total = ref(0)

  // Filters
  const search = ref('')
  const sortField = ref('id')
  const sortDirection = ref<'asc' | 'desc'>('desc')

  /**
   * Fetch all RSS feeds with pagination and filters
   */
  const fetchFeeds = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await rssFeedService.getAll({
        search: search.value || undefined,
        sort: sortField.value,
        direction: sortDirection.value,
        page: currentPage.value,
        per_page: perPage.value,
      })

      feeds.value = response.data.data
      currentPage.value = response.data.meta.current_page
      lastPage.value = response.data.meta.last_page
      perPage.value = response.data.meta.per_page
      total.value = response.data.meta.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch RSS feeds'
      console.error('Error fetching RSS feeds:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single RSS feed by ID
   */
  const fetchFeedById = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const response = await rssFeedService.getById(id)
      currentFeed.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch RSS feed'
      console.error('Error fetching RSS feed:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new RSS feed
   */
  const createFeed = async (feedData: RssFeedFormData) => {
    loading.value = true
    error.value = null

    try {
      const response = await rssFeedService.create(feedData)
      await fetchFeeds() // Refresh the list
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to create RSS feed'
      console.error('Error creating RSS feed:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing RSS feed
   */
  const updateFeed = async (id: number | string, feedData: RssFeedFormData) => {
    loading.value = true
    error.value = null

    try {
      const response = await rssFeedService.update(id, feedData)
      await fetchFeeds() // Refresh the list
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to update RSS feed'
      console.error('Error updating RSS feed:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an RSS feed
   */
  const deleteFeed = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      await rssFeedService.delete(id)
      await fetchFeeds() // Refresh the list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete RSS feed'
      console.error('Error deleting RSS feed:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Set search filter
   */
  const setSearch = (value: string) => {
    search.value = value
    currentPage.value = 1 // Reset to first page
  }

  /**
   * Set sort options
   */
  const setSort = (field: string, direction: 'asc' | 'desc' = 'desc') => {
    sortField.value = field
    sortDirection.value = direction
    currentPage.value = 1 // Reset to first page
  }

  /**
   * Go to a specific page
   */
  const goToPage = (page: number) => {
    if (page >= 1 && page <= lastPage.value) {
      currentPage.value = page
    }
  }

  /**
   * Computed property for enabled feeds only
   */
  const enabledFeeds = computed(() => {
    return feeds.value.filter(feed => feed.enabled)
  })

  return {
    // State
    feeds,
    currentFeed,
    loading,
    error,
    currentPage,
    lastPage,
    perPage,
    total,
    search,
    sortField,
    sortDirection,

    // Computed
    enabledFeeds,

    // Methods
    fetchFeeds,
    fetchFeedById,
    createFeed,
    updateFeed,
    deleteFeed,
    setSearch,
    setSort,
    goToPage,
  }
}

