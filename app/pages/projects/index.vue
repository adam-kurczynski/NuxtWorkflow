<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
      <UInput v-model="search" placeholder="Szukaj projektu..." class="flex-1" icon="i-material-symbols-search" />
      <UButton
        icon="i-material-symbols-add-2"
        class="shrink-0 justify-center"
        @click="isOpen = true"
      >
        Dodaj projekt
      </UButton>
    </div>

    <div v-if="projects && projects.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="projectData in projects"
        :key="projectData.projects.id"
        class="flex flex-col justify-between h-full hover:border-stone-700 transition-colors"
      >
        <div class="flex flex-col h-full justify-between gap-3">
          <div class="flex flex-col gap-1.5">
            <div class="flex justify-between items-start gap-2">
              <h1 class="font-bold text-base text-stone-100 leading-snug">{{ projectData.projects.name }}</h1>
              <span class="text-xs text-stone-400 shrink-0">
                {{ formatDate(projectData.projects.createdAt) }}
              </span>
            </div>
            <UBadge v-if="projectData.clients" class="w-fit" variant="subtle" color="primary">{{
              projectData.clients.name
            }}</UBadge>
            <p v-if="projectData.projects.description" class="text-sm text-stone-400 line-clamp-2">
              {{ projectData.projects.description }}
            </p>
          </div>
          <div class="flex justify-between gap-2 pt-2 border-t border-stone-800/80">
            <UButton
              icon="i-material-symbols-edit"
              class="w-1/2 flex justify-center text-xs"
              variant="soft"
              size="sm"
              @click="editProject(projectData.projects.id)"
            >
              Edytuj
            </UButton>
            <UButton
              class="w-1/2 flex justify-center text-xs"
              variant="soft"
              color="primary"
              size="sm"
              icon="i-material-symbols-info"
              @click="navigateTo(`/projects/${projectData.projects.id}`)"
            >
              Szczegóły
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <UCard v-else-if="projects" class="text-center py-8 border-dashed border-stone-800">
      <p class="text-stone-400 text-sm">Nie znaleziono żadnych projektów</p>
    </UCard>

    <UModal
      v-model:open="isOpen"
      :title="currentProjectId ? 'Edytuj projekt' : 'Dodaj projekt'"
      fullscreen
      class="p-4"
    >
      <template #body>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="createOrUpdateProject"
        >
          <UFormField required label="Nazwa" name="name">
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField required label="Opis" name="description">
            <UTextarea v-model="state.description" class="w-full" :rows="4" />
          </UFormField>
          <UFormField label="Klient" name="clientId">
            <USelect
              v-if="clients"
              v-model="state.clientId"
              class="w-full"
              option-attribute="name"
              :items="
                clients.map((client) => {
                  return {
                    label: client.name,
                    value: client.id,
                  };
                })
              "
            />
          </UFormField>
          <UFormField label="Notatki" name="notes">
            <UTextarea v-model="state.notes" class="w-full" :rows="4" />
          </UFormField>
          <UButton type="submit" class="w-full flex-row justify-center">
            Zapisz
          </UButton>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import formatDate from "~~/utils/formatDate";

definePageMeta({
  title: "Projekty",
  description: "Lista wszystkich projektów",
  middleware: ["auth"],
});

const onSuccessfulSubmit = () => {
  isOpen.value = false;
  search.value = "";
  refreshProjects();
};

const { data: clients } = await useFetch("/api/clients");
const {
  currentProjectId,
  isOpen,
  search,
  projects,
  createOrUpdateProject,
  refreshProjects,
  schema,
  state,
  editProject,
  clearForm,
} = useProjects(onSuccessfulSubmit);

watch(isOpen, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    clearForm();
  }
});
</script>

<style></style>
