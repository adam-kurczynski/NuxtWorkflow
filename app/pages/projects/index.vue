<template>
  <UInput v-model="search" placeholder="Szukaj" class="w-full" />
  <UCard v-if="data" v-for="projectData in data" :key="projectData.projects.id" class="mb-2">
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
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField required label="Nazwa" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField required label="Opis" name="description">
          <UInput v-model="state.description" class="w-full" />
        </UFormField>
        <UFormField required label="Klient" name="clientId">
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
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import type { ProjectResponse } from "~~/server/api/types";

definePageMeta({
  title: "Projekty",
  description: "Projekty",
  middleware: ["auth"],
})

const toast = useToast();
const router = useRouter();

const search = ref("");

const { data, refresh } = await useFetch<ProjectResponse[]>("/api/projects", {
  query: {
    search: search
  }
});
const { data: clients } = await useFetch("/api/clients");
const isOpen = ref(false);

const schema = object({
  name: string().required("Pole wymagane"),
  description: string().required("Pole wymagane"),
  clientId: number().required("Pole wymagane")
})

type Schema = InferType<typeof schema>;

const state = reactive({
  name: undefined,
  description: undefined,
  clientId: undefined
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  try {
    await $fetch("/api/projects", {
      method: "POST",
      body: {
        ...event.data,
        status: "nowy"
      }
    });
    isOpen.value = false;
    toast.add({
      color: 'success',
      title: "Dodano projekt",
    });
    refresh();

  } catch (error) {
    toast.add({
      title: "Nie udało się dodać projektu",
      color: 'error',
    });
  }
}


</script>

<style></style>