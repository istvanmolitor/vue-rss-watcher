<script setup lang="ts">
import AdminLayout from '@admin/components/layout/DashboardLayout.vue'
import Button from '@admin/components/ui/Button.vue'
import Input from '@admin/components/ui/Input.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
import FormButtons from '@admin/components/ui/FormButtons.vue'
import Checkbox from '@admin/components/ui/Checkbox.vue'
import { useRouter, useRoute } from 'vue-router'
import { reactive, ref, onMounted } from 'vue'
import { rssFeedService, type RssFeedFormData } from '../../services/rssFeedService'

const router = useRouter()
const route = useRoute()
const isSaving = ref(false)
const isLoading = ref(true)

const form = reactive<RssFeedFormData>({
  name: '',
  url: '',
  enabled: true
})

const feedId = ref<string | number>(route.params.id as string)

const fetchFeed = async () => {
  try {
    isLoading.value = true
    const response = await rssFeedService.getById(feedId.value)
    const feed = response.data.data

    form.name = feed.name
    form.url = feed.url
    form.enabled = feed.enabled
  } catch (error) {
    console.error('Hiba az RSS feed betöltésekor:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  try {
    isSaving.value = true
    await rssFeedService.update(feedId.value, form)
    router.push('/rss-feeds')
  } catch (error) {
    console.error('Hiba az RSS feed módosításakor:', error)
  } finally {
    isSaving.value = false
  }
}

const goBack = () => {
  router.push('/rss-feeds')
}

onMounted(() => {
  fetchFeed()
})
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between space-y-2 mb-4">
      <h2 class="text-3xl font-bold tracking-tight">RSS Feed szerkesztése</h2>
      <Button variant="outline" @click="goBack">Vissza</Button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      Betöltés...
    </div>

    <Card v-else>
      <CardHeader>
        <CardTitle>RSS Feed adatok</CardTitle>
        <CardDescription>Módosítsd az RSS feed adatait.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <label for="name" class="text-sm font-medium">Név</label>
          <Input id="name" v-model="form.name" placeholder="Tech News Feed" />
        </div>
        <div class="space-y-2">
          <label for="url" class="text-sm font-medium">URL</label>
          <Input id="url" v-model="form.url" type="url" placeholder="https://example.com/feed.xml" />
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="enabled" v-model:checked="form.enabled" />
          <label for="enabled" class="text-sm font-medium cursor-pointer">
            Feed aktív
          </label>
        </div>
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="goBack"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>

