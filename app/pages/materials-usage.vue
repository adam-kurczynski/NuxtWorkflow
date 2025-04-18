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
import type { ProjectResponse, Asset } from '~~/server/api/types'
import formatDateTime from '~~/utils/formatDateTime'

definePageMeta({
  title: 'Użycie materiałów',
  description: 'Użycie materiałów',
  middleware: ['auth']
})

const { data: projects } = await useFetch<ProjectResponse[]>('/api/projects')
const { data: assets } = await useFetch<Asset[]>('/api/assets')

const { materialsUsage, state, schema, refresh, deleteMaterial } = useUsage()

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