<script setup lang="ts">
import { AdminLayout, BackButton } from '@admin'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import { useRouter, useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'
import { rssFeedItemService, type RssFeedItem } from '../../services/rssFeedItemService'

const router = useRouter()
const route = useRoute()
const isLoading = ref(true)
const item = ref<RssFeedItem | null>(null)

const fetchItem = async () => {
  const id = route.params.id as string
  try {
    isLoading.value = true
    const response = await rssFeedItemService.getById(id)
    item.value = response.data.data
  } catch (error) {
    console.error('Hiba az RSS elem betöltésekor:', error)
    router.push('/rss-items')
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('hu-HU')
}

onMounted(() => {
  fetchItem()
})
</script>

<template>
  <AdminLayout pageTitle="RSS Elem részletei">
    <div class="flex items-center justify-between space-y-2 mb-4">
      <BackButton to="/rss-items" />
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <div v-else-if="item" class="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{{ item.title }}</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="item.feed" class="space-y-1">
            <label class="text-sm font-medium text-gray-500">Feed</label>
            <p class="text-base">{{ item.feed.name }}</p>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-500">Link</label>
            <a :href="item.link" target="_blank" class="text-blue-600 hover:underline block">
              {{ item.link }}
            </a>
          </div>

          <div v-if="item.published_at" class="space-y-1">
            <label class="text-sm font-medium text-gray-500">Publikálva</label>
            <p class="text-base">{{ formatDate(item.published_at) }}</p>
          </div>

          <div v-if="item.image" class="space-y-1">
            <label class="text-sm font-medium text-gray-500">Kép</label>
            <img :src="item.image" :alt="item.title" class="max-w-md rounded-lg" />
          </div>

          <div v-if="item.description" class="space-y-1">
            <label class="text-sm font-medium text-gray-500">Leírás</label>
            <div class="prose max-w-none" v-html="item.description"></div>
          </div>

          <div class="space-y-1">
            <label class="text-sm font-medium text-gray-500">GUID</label>
            <p class="text-sm text-gray-700 font-mono">{{ item.guid }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-500">Létrehozva</label>
              <p class="text-sm">{{ formatDate(item.created_at) }}</p>
            </div>
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-500">Módosítva</label>
              <p class="text-sm">{{ formatDate(item.updated_at) }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      Nem található az RSS elem.
    </div>
  </AdminLayout>
</template>

