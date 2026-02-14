import { ref, computed } from 'vue'
import { rssFeedItemService, type RssFeedItem } from '../services/rssFeedItemService'

export function useRssFeedItems() {
  const items = ref<RssFeedItem[]>([])
  const currentItem = ref<RssFeedItem | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Pagination
  const currentPage = ref(1)
  const lastPage = ref(1)
  const perPage = ref(15)
  const total = ref(0)

  // Filters
  const feedId = ref<number | undefined>(undefined)
  const search = ref('')
  const sortField = ref('published_at')
  const sortDirection = ref<'asc' | 'desc'>('desc')

  /**
   * Fetch all RSS feed items with pagination and filters
   */
  const fetchItems = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await rssFeedItemService.getAll({
        feed_id: feedId.value,
        search: search.value || undefined,
        sort: sortField.value,
        direction: sortDirection.value,
        page: currentPage.value,
        per_page: perPage.value,
      })

      items.value = response.data.data
      currentPage.value = response.data.meta.current_page
      lastPage.value = response.data.meta.last_page
      perPage.value = response.data.meta.per_page
      total.value = response.data.meta.total
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch RSS feed items'
      console.error('Error fetching RSS feed items:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Fetch a single RSS feed item by ID
   */
  const fetchItemById = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const response = await rssFeedItemService.getById(id)
      currentItem.value = response.data.data
      return response.data.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to fetch RSS feed item'
      console.error('Error fetching RSS feed item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an RSS feed item
   */
  const deleteItem = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      await rssFeedItemService.delete(id)
      await fetchItems() // Refresh the list
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to delete RSS feed item'
      console.error('Error deleting RSS feed item:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Set feed filter
   */
  const setFeedFilter = (id: number | undefined) => {
    feedId.value = id
    currentPage.value = 1 // Reset to first page
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
   * Computed property for items grouped by feed
   */
  const itemsByFeed = computed(() => {
    const grouped: Record<number, RssFeedItem[]> = {}
    items.value.forEach(item => {
      if (!grouped[item.rss_feed_id]) {
        grouped[item.rss_feed_id] = []
      }
      grouped[item.rss_feed_id].push(item)
    })
    return grouped
  })

  return {
    // State
    items,
    currentItem,
    loading,
    error,
    currentPage,
    lastPage,
    perPage,
    total,
    feedId,
    search,
    sortField,
    sortDirection,

    // Computed
    itemsByFeed,

    // Methods
    fetchItems,
    fetchItemById,
    deleteItem,
    setFeedFilter,
    setSearch,
    setSort,
    goToPage,
  }
}

