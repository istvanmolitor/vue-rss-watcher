<script setup lang="ts">
import AdminLayout from '@admin/components/layout/AdminLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import RowActions from '@admin/components/ui/RowActions.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { rssFeedService, type RssFeed } from '../../services/rssFeedService'

const router = useRouter()
const feeds = ref<RssFeed[]>([])
const isLoading = ref(false)
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
  if (!confirm('Biztosan törölni szeretnéd ezt az RSS feedet?')) {
    return
  }

  try {
    await rssFeedService.delete(id)
    await fetchFeeds({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba az RSS feed törlésekor:', error)
  }
}

const editFeed = (id: number) => {
  router.push(`/rss-feeds/${id}/edit`)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return 'Még nem volt'
  return new Date(dateString).toLocaleString('hu-HU')
}
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold tracking-tight">RSS Feedek</h2>
    </div>

    <DataTable
      :columns="columns"
      :data="feeds"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Keresés név vagy URL alapján..."
      default-sort="id"
      default-direction="desc"
      @fetch="fetchFeeds"
    >
      <template #actions>
        <Button @click="router.push('/rss-feeds/create')">
          <Icon name="plus" :size="16" class="mr-2" />
          Új RSS Feed
        </Button>
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
        <RowActions
          @edit="editFeed(row.id)"
          @delete="deleteFeed(row.id)"
        />
      </template>

      <template #empty>
        Nincs megjeleníthető RSS feed.
      </template>
    </DataTable>
  </AdminLayout>
</template>

