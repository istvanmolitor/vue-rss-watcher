<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/button/Button.vue'
import Icon from '@admin/components/ui/Icon.vue'
import RowActions from '@admin/components/ui/RowActions.vue'
import DataTable, { type Column, type PaginationMeta } from '@admin/components/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { rssFeedItemService, type RssFeedItem } from '../../services/rssFeedItemService'

const router = useRouter()
const items = ref<RssFeedItem[]>([])
const isLoading = ref(false)
const pagination = ref<PaginationMeta>({
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0
})

const columns: Column<RssFeedItem>[] = [
  { key: 'id', label: 'ID', sortable: true, width: '80px' },
  { key: 'title', label: 'Cím', sortable: true },
  { key: 'feed', label: 'Feed', sortable: false, width: '200px' },
  { key: 'published_at', label: 'Publikálva', sortable: true, width: '180px' },
]

const fetchItems = async (params: {
  search?: string
  sort?: string
  direction?: 'asc' | 'desc'
  page?: number
}) => {
  try {
    isLoading.value = true
    const response = await rssFeedItemService.getAll(params)
    items.value = response.data.data
    pagination.value = response.data.meta
  } catch (error) {
    console.error('Hiba az RSS elemek betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteItem = async (id: number) => {
  if (!confirm('Biztosan törölni szeretnéd ezt az RSS elemet?')) {
    return
  }

  try {
    await rssFeedItemService.delete(id)
    await fetchItems({ page: pagination.value.current_page })
  } catch (error) {
    console.error('Hiba az RSS elem törlésekor:', error)
  }
}

const viewItem = (id: number) => {
  router.push(`/rss-items/${id}`)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('hu-HU')
}
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-3xl font-bold tracking-tight">RSS Elemek</h2>
    </div>

    <DataTable
      :columns="columns"
      :data="items"
      :loading="isLoading"
      :pagination="pagination"
      :searchable="true"
      search-placeholder="Keresés cím vagy leírás alapján..."
      default-sort="published_at"
      default-direction="desc"
      @fetch="fetchItems"
    >
      <template #cell-feed="{ row }">
        <span v-if="row.feed" class="text-sm font-medium">{{ row.feed.name }}</span>
        <span v-else class="text-sm text-gray-500">-</span>
      </template>

      <template #cell-title="{ row }">
        <a :href="row.link" target="_blank" class="text-blue-600 hover:underline line-clamp-2">
          {{ row.title }}
        </a>
      </template>

      <template #cell-published_at="{ row }">
        <span class="text-sm">{{ formatDate(row.published_at) }}</span>
      </template>

      <template #row-actions="{ row }">
        <RowActions
          @edit="viewItem(row.id)"
          @delete="deleteItem(row.id)"
          edit-label="Megtekintés"
        />
      </template>

      <template #empty>
        Nincs megjeleníthető RSS elem.
      </template>
    </DataTable>
  </AdminLayout>
</template>

