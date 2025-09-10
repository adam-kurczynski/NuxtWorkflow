<template>
  <main class="flex flex-col gap-4">
    <UCard v-if="project" class="p-4">
      <template #header>
        <h1 class="font-bold">{{ project.projects.name }}</h1>
        <p>{{ project.projects.description }}</p>
      </template>
      <p>{{ project.clients?.name }}</p>
      <template #footer>
        <p>{{ project.projects.notes }}</p>
      </template>
    </UCard>
    <div class="self-end">
      <UsageForm
        :show-projects-dropdown="false"
        :project-id="id"
        @submit="refresh"
      />
    </div>
    <UCard v-if="materialsUsage && materialsUsage.length > 0" class="p-4">
      <template #header>
        <h1 class="text-2xl font-bold">Wykorzystane materiały</h1>
      </template>
      <div
        v-for="material in materialsUsage"
        :key="material.assetName"
        class="flex justify-between"
      >
        <h1 class="font-black">{{ material.assetName }}</h1>
        <p>{{ material.quantity + " " + material.unit }}</p>
      </div>
    </UCard>
  </main>
</template>

<script lang="ts" setup>
import type { ProjectResponse } from "~~/server/api/types";
import type { AggregatedUsageResponse } from "~~/server/api/types";
const route = useRoute();
const id = parseInt(route.params.id as string);

const { data: project } = await useFetch<ProjectResponse>(`/api/projects/`, {
  query: {
    id: id,
  },
});

const { data: materialsUsage, refresh } = await useFetch<
  AggregatedUsageResponse[]
>(`/api/usage`, {
  query: {
    projectId: id,
    isGrouped: true,
  },
});

definePageMeta({
  title: "Szczegóły projektu",
  middleware: ["auth"],
  layout: "nested",
});
</script>

<style></style>
