<script setup lang="ts">
import { AdminLayout, toastService, EditButton, DeleteButton, IconButton, CreateButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { rssFeedService } from '../../services/rssFeedService'

const router = useRouter()
const table = ref()
const fetchingId = ref<number | null>(null)

const deleteFeed = async (id: number) => {
  try {
    await rssFeedService.delete(id)
    toastService.success('RSS feed sikeresen törölve!')
    table.value?.refresh()
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
    table.value?.refresh()
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
</script>

<template>
  <AdminLayout pageTitle="RSS Feedek">
    <DataTable
      ref="table"
      url="/api/rss-watcher/feeds"
    >
      <template #actions>
        <CreateButton to="/admin/rss-feed/create">Új RSS Feed</CreateButton>
      </template>

      <template #cell-enabled="{ row }">
        <span v-if="(row as any).enabled" class="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
          Aktív
        </span>
        <span v-else class="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
          Inaktív
        </span>
      </template>

      <template #cell-url="{ row }">
        <a :href="(row as any).url" target="_blank" class="text-blue-600 hover:underline truncate block max-w-md">
          {{ (row as any).url }}
        </a>
      </template>

      <template #cell-last_fetched_at="{ row }">
        <span class="text-sm">{{ formatDate((row as any).last_fetched_at) }}</span>
      </template>

      <template #row-actions="{ row }">
        <IconButton
          icon="RefreshCcw"
          title="Frissítés"
          :disabled="fetchingId === (row as any).id"
          @click="fetchFeed((row as any).id)"
        />
        <EditButton @click="editFeed((row as any).id)" />
        <DeleteButton @confirm="deleteFeed((row as any).id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető RSS feed.
      </template>
    </DataTable>
  </AdminLayout>
</template>
