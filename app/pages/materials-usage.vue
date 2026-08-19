<template>
  <main class="flex flex-col gap-6">
    <UCard>
      <UForm
        :schema="schema"
        :state="state"
        @submit="refresh"
        class="space-y-4"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <UFormField label="Materiał" name="assetId">
            <USelect
              v-if="assets"
              v-model="state.assetId"
              option-attribute="name"
              class="w-full"
              :items="prepareAssetsDropdown(assets)"
            />
          </UFormField>
          <UFormField label="Projekt" name="projectId">
            <USelect
              v-if="projects"
              v-model="state.projectId"
              option-attribute="name"
              class="w-full"
              :items="prepareProjectsDropdown(projects)"
            />
          </UFormField>
          <UFormField label="Czas dodania od" name="startTime">
            <UInput v-model="state.startDate" type="date" class="w-full" />
          </UFormField>
          <UFormField label="Czas dodania do" name="endTime">
            <UInput v-model="state.endDate" type="date" class="w-full" />
          </UFormField>
        </div>
        <div class="flex justify-between items-center pt-2">
          <UsageForm :show-projects-dropdown="true" @submit="refresh" />
          <UButton type="submit" icon="i-material-symbols-search" class="px-6 justify-center">
            Szukaj
          </UButton>
        </div>
      </UForm>
    </UCard>

    <div v-if="materialsUsage?.length" class="space-y-3">
      <div class="flex justify-between items-center">
        <h2 class="text-sm font-semibold text-stone-300">{{ `Znaleziono ${materialsUsage.length} pozycji` }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard
          v-for="material in materialsUsage"
          :key="material.asset_usage.id"
          class="relative hover:border-stone-700 transition-colors"
        >
          <UButton
            icon="i-material-symbols-delete-rounded"
            @click="deleteMaterial(material.asset_usage.id)"
            class="absolute top-2 right-2 w-8 h-8 flex justify-center"
            variant="ghost"
            color="error"
            size="xs"
          />
          <div class="flex flex-col gap-2">
            <div>
              <h1 class="text-base font-bold text-stone-100">{{ material.assets?.name }}</h1>
              <p class="text-xs text-stone-400">{{ material.projects?.name }}</p>
            </div>
            <div class="flex justify-between items-center pt-2 border-t border-stone-800 text-xs text-stone-300">
              <span class="font-bold text-sm text-primary">
                {{ material.asset_usage.quantity + " " + material.assets?.unit }}
              </span>
              <span class="text-stone-400">{{ formatDateTime(material.asset_usage.createdAt) }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>
    <UCard v-else class="text-center py-8 border-dashed border-stone-800">
      <p class="text-stone-400 text-sm">Brak danych o użyciu materiałów</p>
    </UCard>
  </main>
</template>

<script lang="ts" setup>
import type { ProjectResponse, Asset } from "~~/server/api/types";
import formatDateTime from "~~/utils/formatDateTime";

definePageMeta({
  title: "Użycie materiałów",
  description: "Użycie materiałów",
  middleware: ["auth"],
  colorMode: "dark",
});

const { data: projects } = await useFetch<ProjectResponse[]>("/api/projects");
const { data: assets } = await useFetch<Asset[]>("/api/assets");

const { materialsUsage, state, schema, refresh, deleteMaterial } = useUsage();

const prepareAssetsDropdown = (assets: any[]) => {
  const out = assets.map((asset) => {
    return {
      label: asset.name,
      value: asset.id,
    };
  });

  out.unshift({ label: "Wszystkie", value: 0 });
  return out;
};

const prepareProjectsDropdown = (projects: any[]) => {
  const out = projects.map((project) => {
    return {
      label: project.projects.name,
      value: project.projects.id,
    };
  });

  out.unshift({ label: "Wszystkie", value: 0 });
  return out;
};
</script>

<style></style>
