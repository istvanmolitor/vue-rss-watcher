<script setup lang="ts">
import { AdminLayout, BackButton, toastService, FormButtons } from '@admin'
import Label from '@admin/components/ui/Label.vue'
import Input from '@admin/components/ui/Input.vue'
import Card from '@admin/components/ui/Card.vue'
import CardContent from '@admin/components/ui/CardContent.vue'
import CardDescription from '@admin/components/ui/CardDescription.vue'
import CardFooter from '@admin/components/ui/CardFooter.vue'
import CardHeader from '@admin/components/ui/CardHeader.vue'
import CardTitle from '@admin/components/ui/CardTitle.vue'
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

const fetchFeed = async () => {
  const id = route.params.id as string
  try {
    isLoading.value = true
    const response = await rssFeedService.getById(id)
    const feed = response.data.data
    form.name = feed.name
    form.url = feed.url
    form.enabled = feed.enabled
  } catch (error) {
    console.error('Hiba az RSS feed betöltésekor:', error)
    router.push('/admin/rss-feed')
  } finally {
    isLoading.value = false
  }
}

const handleSubmit = async () => {
  const id = route.params.id as string
  try {
    isSaving.value = true
    await rssFeedService.update(id, form)
    toastService.success('RSS feed sikeresen frissítve!')
    router.push('/admin/rss-feed')
  } catch (error) {
    console.error('Hiba az RSS feed módosításakor:', error)
    toastService.error('Hiba történt a mentés során.')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchFeed()
})
</script>

<template>
  <AdminLayout pageTitle="RSS Feed szerkesztése">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <BackButton to="/admin/rss-feed" />
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
          <Label for="name">Név</Label>
          <Input id="name" v-model="form.name" placeholder="Tech News Feed" />
        </div>
        <div class="space-y-2">
          <Label for="url">URL</Label>
          <Input id="url" v-model="form.url" type="url" placeholder="https://example.com/feed.xml" />
        </div>
        <div class="flex items-center space-x-2">
          <Checkbox id="enabled" v-model:checked="form.enabled" />
          <Label for="enabled" class="cursor-pointer">Feed aktív</Label>
        </div>
      </CardContent>
      <CardFooter>
        <FormButtons
          :is-saving="isSaving"
          @save="handleSubmit"
          @cancel="router.push('/admin/rss-feed')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>

