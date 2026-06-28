<script setup lang="ts">
import { AdminLayout, toastService, DeleteButton, ShowButton } from '@admin'
import DataTable from '@admin/components/ui/dataTable/DataTable.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { rssFeedItemService } from '../../services/rssFeedItemService'

const router = useRouter()
const table = ref()

const deleteItem = async (id: number) => {
  try {
    await rssFeedItemService.delete(id)
    toastService.success('RSS elem sikeresen törölve!')
    table.value?.refresh()
  } catch (error) {
    console.error('Hiba az RSS elem törlésekor:', error)
    toastService.error('Hiba történt a törlés során.')
  }
}

const viewItem = (id: number) => {
  router.push(`/admin/rss-item/${id}`)
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('hu-HU')
}
</script>

<template>
  <AdminLayout pageTitle="RSS Elemek">
    <DataTable
      ref="table"
      url="/api/rss-watcher/items"
    >
      <template #cell-feed="{ row }">
        <span v-if="(row as any).feed" class="text-sm font-medium">{{ (row as any).feed.name }}</span>
        <span v-else class="text-sm text-gray-500">-</span>
      </template>

      <template #cell-title="{ row }">
        <a :href="(row as any).link" target="_blank" class="text-blue-600 hover:underline line-clamp-2">
          {{ (row as any).title }}
        </a>
      </template>

      <template #cell-published_at="{ row }">
        <span class="text-sm">{{ formatDate((row as any).published_at) }}</span>
      </template>

      <template #row-actions="{ row }">
        <ShowButton @click="viewItem((row as any).id)" />
        <DeleteButton @confirm="deleteItem((row as any).id)" />
      </template>

      <template #empty>
        Nincs megjeleníthető RSS elem.
      </template>
    </DataTable>
  </AdminLayout>
</template>
