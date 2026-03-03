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
import { useRouter } from 'vue-router'
import { reactive, ref } from 'vue'
import { rssFeedService, type RssFeedFormData } from '../../services/rssFeedService'

const router = useRouter()
const isSaving = ref(false)

const form = reactive<RssFeedFormData>({
  name: '',
  url: '',
  enabled: true
})

const handleSubmit = async () => {
  try {
    isSaving.value = true
    await rssFeedService.create(form)
    toastService.success('RSS feed sikeresen létrehozva!')
    router.push('/rss-feeds')
  } catch (error) {
    console.error('Hiba az RSS feed létrehozásakor:', error)
    toastService.error('Hiba történt a mentés során.')
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <AdminLayout pageTitle="Új RSS Feed">
    <div class="flex items-center justify-end space-y-2 mb-4">
      <BackButton to="/rss-feeds" />
    </div>

    <Card>
      <CardHeader>
        <CardTitle>RSS Feed adatok</CardTitle>
        <CardDescription>Add meg az új RSS feed adatait a létrehozáshoz.</CardDescription>
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
          @cancel="router.push('/rss-feeds')"
        />
      </CardFooter>
    </Card>
  </AdminLayout>
</template>

