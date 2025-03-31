<template>
  <UCard v-if="project" class="p-4">
    <template #header>
      <h1 class="text-2xl font-bold">{{ project.projects.name }}</h1>
      <p>{{ project.projects.description }}</p>
    </template>
    <p>{{ project.clients?.name }}</p>
  </UCard>
  <UCard v-if="materialsUsage && materialsUsage.length > 0" class="p-4">
    <template #header>
      <h1 class="text-2xl font-bold">Wykorzystane materiały</h1>
    </template>
    <div v-for="material in materialsUsage" :key="material.assetName" class="flex justify-between">
      <h1 class="font-black">{{ material.assetName }}</h1>
      <p>{{ material.quantity + " " + material.unit }}</p>
    </div>
  </UCard>
  <UsageForm :show-projects-dropdown="false" :project-id="id" @submit="refresh" button-text="Dodaj materiał" />
</template>

<script lang="ts" setup>
import type { ProjectResponse } from '~~/server/api/types';
import type { AggregatedUsageResponse } from '~~/server/api/types';
const route = useRoute();
const id = parseInt(route.params.id as string);

const { data: project } = await useFetch<ProjectResponse>(`/api/projects/`, {
  query: {
    id: id
  }
})

const { data: materialsUsage, refresh } = await useFetch<AggregatedUsageResponse[]>(`/api/usage`, {
  query: {
    projectId: id,
    isGrouped: true
  }
})

definePageMeta({
  title: "Szczegóły projektu",
  middleware: ["auth"],
})

</script>


<style></style>