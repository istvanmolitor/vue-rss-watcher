<script setup lang="ts">
import { AdminLayout, toastService, EditButton, DeleteButton, IconButton, CreateButton } from '@admin'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { rssFeedService, type RssFeed } from '../../services/rssFeedService'

const router = useRouter()
const feeds = ref<RssFeed[]>([])
const isLoading = ref(false)
const fetchingId = ref<number | null>(null)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

const columns: Column<RssFeed>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'name', label: 'Név', sortable: true },
  { key: 'url', label: 'URL', sortable: false },
  { key: 'enabled', label: 'Állapot', sortable: true, width: '120px' },
  { key: 'last_fetched_at', label: 'Utolsó lekérés', sortable: true, width: '180px' },
]

const fetchFeeds = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await rssFeedService.getAll(params)
    feeds.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba az RSS feedek betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteFeed = async (id: number) => {
  try {
    await rssFeedService.delete(id)
    toastService.success('RSS feed sikeresen törölve!')
    await fetchFeeds({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba az RSS feed törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const editFeed = (id: number) => {
  router.push(`/admin/rss-feed/${id}/edit`)
}

const fetchFeed = async (id: number) => {
  try {
    fetchingId.value = id
    await rssFeedService.fetch(id)
    toastService.success('RSS feed sikeresen frissítve!')
    await fetchFeeds({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba az RSS feed frissítésekor:', error)
    toastService.error('Hiba történt a frissítés során.')
  } finally {
    fetchingId.value = null
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Még nem volt'
  return new Date(dateString).toLocaleString('hu-HU')
}

onMounted(() => {
  fetchFeeds({ page: 1, sort: 'id', direction: 'desc' })
})
</script>

<template>
  <AdminLayout pageTitle="RSS Feedek">
    <DataTable
      :columns="columns"
      :data="feeds"
      :loading="isLoading"
      :pagination="pagination"
      search-placeholder="Keresés név vagy URL alapján..."
      default-sort="id"
      default-direction="desc"
      @fetch="fetchFeeds"
    >
      <template #actions>
        <CreateButton to="/admin/rss-feed/create">Új RSS Feed</CreateButton>
      </template>

      <template #cell-enabled="{ row }">
        <span v-if="row.enabled" class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
          Aktív
        </span>
        <span v-else class="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
          Inaktív
        </span>
      </template>

      <template #cell-url="{ row }">
        <a :href="row.url" target="_blank" class="text-blue-600 hover:underline truncate block max-w-md">
          {{ row.url }}
        </a>
      </template>

      <template #cell-last_fetched_at="{ row }">
        <span class="text-sm">{{ formatDate(row.last_fetched_at) }}</span>
      </template>

      <template #row-actions="{ row }">
        <IconButton
          icon="RefreshCcw"
          title="Frissítés"
          :disabled="fetchingId === row.id"
          @click="fetchFeed(row.id)"
        />
        <EditButton @click="editFeed(row.id)" />
        <DeleteButton @confirm="deleteFeed(row.id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető RSS feed.
      </template>
    </DataTable>
  </AdminLayout>
</template>

