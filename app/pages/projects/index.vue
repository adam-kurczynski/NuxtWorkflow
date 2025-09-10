<template>
  <div>
    <div class="flex justify-end items-center absolute top-20 right-4 gap-4">
      <UButton
        class="mb-4"
        icon="i-material-symbols-add-2"
        @click="isOpen = true"
      >
        Dodaj projekt
      </UButton>
    </div>
    <UInput v-model="search" placeholder="Szukaj" class="w-full" />
    <div v-if="projects" class="flex flex-col mt-4">
      <UCard
        v-for="projectData in projects"
        :key="projectData.projects.id"
        class="mb-4 relative"
      >
        <div class="flex flex-col">
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center">
              <h1 class="font-bold">{{ projectData.projects.name }}</h1>
              <p class="text-xs text-stone-400">
                {{ formatDate(projectData.projects.createdAt) }}
              </p>
            </div>
            <UBadge v-if="projectData.clients" class="w-fit">{{
              projectData.clients.name
            }}</UBadge>
            <p class="text-sm text-stone-400">
              {{ projectData.projects.description }}
            </p>
          </div>
          <div class="flex justify-between mt-2 gap-2">
            <UButton
              icon="i-material-symbols-edit"
              class="w-1/2 flex justify-center text-xs"
              variant="soft"
              :ui="{ leadingIcon: 'size-4' }"
              @click="editProject(projectData.projects.id)"
              >Edytuj</UButton
            >
            <UButton
              class="w-1/2 flex justify-center text-xs"
              variant="soft"
              icon="i-material-symbols-info"
              :ui="{ leadingIcon: 'size-4' }"
              @click="navigateTo(`/projects/${projectData.projects.id}`)"
            >
              Szczegóły</UButton
            >
          </div>
        </div>
      </UCard>
    </div>
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
