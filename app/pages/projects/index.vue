<template>
  <UInput v-model="search" placeholder="Szukaj" class="w-full" />
  <UCard v-if="projects" v-for="projectData in projects" :key="projectData.projects.id" class="mb-2">
    <div class="flex justify-between">
      <h1 class="text-xl font-bold">{{ projectData.projects.name }}</h1>
      <UButton class="flex items-center justify-center " icon="i-material-symbols-edit"
        @click="navigateTo(`/projects/${projectData.projects.id}`)">
        Szczegóły</UButton>
    </div>
    <p>{{ projectData.projects.description }}</p>
    <p v-if="projectData.clients">{{ projectData.clients.name }}</p>
  </UCard>
  <UModal v-model:open="isOpen" title="Dodaj projekt" fullscreen class="p-4">
    <AddFormButton />
    <template #body>
      <UForm :schema="schema" :state="state" @submit="createProject" class="space-y-4">
        <UFormField required label="Nazwa" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField required label="Opis" name="description">
          <UInput v-model="state.description" class="w-full" />
        </UFormField>
        <UFormField label="Klient" name="clientId">
          <USelect v-if="clients" class="w-full" v-model="state.clientId" option-attribute="name" :items="clients.map(client => {
            return {
              label: client.name,
              value: client.id
            }
          })" />
        </UFormField>
        <UButton type="submit" class="w-full flex-row justify-center">
          Dodaj
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { object, string, number } from "yup";

definePageMeta({
  title: "Projekty",
  description: "Projekty",
  middleware: ["auth"],
})

const onSuccessfulSubmit = () => {
  isOpen.value = false;
  search.value = "";
  refreshProjects();
};

const isOpen = ref(false);
const { data: clients } = await useFetch("/api/clients");
const { search, projects, createProject, refreshProjects, schema } = useProjects(onSuccessfulSubmit);

const state = reactive({
  name: '',
  description: '',
  clientId: 0
})



</script>

<style></style>