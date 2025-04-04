<template>
  <UForm :schema="schema" :state="state" @submit="refresh" class="space-y-4 flex gap-2 flex-col">
    <UFormField label="Materiał" name="assetId">
      <USelect v-if="assets" v-model="state.assetId" option-attribute="name" class="w-full"
        :items="prepareAssetsDropdown(assets)" />
    </UFormField>
    <UFormField label="Projekt" name="projectId">
      <USelect v-if="projects" v-model="state.projectId" option-attribute="name" class="w-full"
        :items="prepareProjectsDropdown(projects)" />
    </UFormField>
    <UFormField label="Czas dodania od" name="startTime">
      <UInput v-model="state.startDate" type="date" class="w-full" />
    </UFormField>
    <UFormField label="Czas dodania do" name="endTime">
      <UInput v-model="state.endDate" type="date" class="w-full" />
    </UFormField>
    <UButton type="submit" class="w-full flex-row justify-center">
      Szukaj
    </UButton>
  </UForm>

  <UsageForm :show-projects-dropdown="true" @submit="refresh" />
  <div v-if="materialsUsage?.length" class="space-y-4">
    <h1>{{ `Znaleziono ${materialsUsage.length} pozycji` }}</h1>
    <UCard v-for="material in materialsUsage" :key="material.asset_usage.id" class="relative">
      <UButton icon="i-material-symbols-delete-rounded" @click="deleteMaterial(material.asset_usage.id)"
        class="absolute top-2 right-2 w-8 h-8 flex justify-center" />
      <div class="flex justify-between">
        <div>
          <h1 class="text-xl font-bold">{{ material.assets?.name }}</h1>
          <p>{{ material.projects?.name }}</p>
        </div>
        <div>
          <p>{{ material.asset_usage.quantity + " " + material.assets?.unit }}</p>
          <p>{{ formatDateTime(material.asset_usage.createdAt) }}</p>
        </div>
      </div>
    </UCard>
  </div>
  <div v-else>
    <p>Brak danych</p>
  </div>
</template>

<script lang="ts" setup>
import { object, string, number, type InferType } from 'yup'
import type { AssetUsageResponse } from '~~/server/api/types'
import formatDateTime from '~~/utils/formatDateTime'

definePageMeta({
  title: 'Użycie materiałów',
  description: 'Użycie materiałów',
  middleware: ['auth']
})

const getPreviousMonthDate = () => {
  const date = new Date()
  date.setMonth(date.getMonth() - 1)
  return date.toISOString().split('T')[0]
}


const state = reactive({
  projectId: 0,
  assetId: 0,
  startDate: getPreviousMonthDate(),
  endDate: new Date().toISOString().split('T')[0],
})

const schema = object({
  projectId: number().required("Pole wymagane"),
  assetId: number().required('Pole wymagane'),
  startDate: string().required('Pole wymagane'),
  endDate: string().required('Pole wymagane')
})

const Toast = useToast()
const { data: projects } = await useFetch('/api/projects')
const { data: assets } = await useFetch('/api/assets')

const getURL = computed(() => `/api/usage?projectId=${state.projectId}&assetId=${state.assetId}&startDate=${state.startDate}&endDate=${state.endDate}`)

const { data: materialsUsage, error, refresh } = useFetch<AssetUsageResponse[]>(getURL, {
  watch: false,
})

const deleteMaterial = async (id: number) => {
  try {
    await $fetch(`/api/usage?id=${id}`, {
      method: 'DELETE'
    })
    Toast.add({
      title: 'Usunięto',
      description: 'Usunięto materiał',
      color: 'success'
    })
    refresh()
  } catch (error) {
    Toast.add({
      title: 'Wystąpił błąd',
      description: 'Błąd podczas usuwania materiału',
      color: 'error'
    })
  }
}

const prepareAssetsDropdown = (assets: any[]) => {
  const out = assets.map(asset => {
    return {
      label: asset.name,
      value: asset.id
    }
  })

  out.unshift({ label: 'Wszystkie', value: 0 })
  return out
}

const prepareProjectsDropdown = (projects: any[]) => {
  const out = projects.map(project => {
    return {
      label: project.projects.name,
      value: project.projects.id
    }
  })

  out.unshift({ label: 'Wszystkie', value: 0 })
  return out
}

</script>

<style></style>