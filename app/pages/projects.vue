<template>
  <div class="p-2">
    <UCard v-if="data" v-for="projectData in data" :key="projectData.projects.id" class="mb-2">
      <div class="flex justify-between">
        <h1 class="text-xl font-bold">{{ projectData.projects.name }}</h1>
      </div>
      <p>{{ projectData.projects.description }}</p>
      <p v-if="projectData.clients">{{ projectData.clients.name }}</p>
    </UCard>
    <UButton icon="i-material-symbols-add-2" @click="isOpen = true"
      class="fixed bottom-24 right-8 w-12 h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]" />
    <UModal v-model="isOpen">
      <div class="p-4">
        <h1 class="text-2xl font-bold">Dodaj Projekt</h1>
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
          <UFormGroup label="Nazwa" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Opis" name="description">
            <UInput v-model="state.description" />
          </UFormGroup>
          <UFormGroup label="Klient" name="clientId">
            <USelect v-if="clients" v-model="state.clientId" option-attribute="name" :options="clients.map(client => {
              return {
                name: client.name,
                value: client.id
              }
            })" />
          </UFormGroup>
          <UButton type="submit" class="w-full flex-row justify-center">
            Dodaj
          </UButton>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
const { data, refresh } = await useFetch("/api/projects");
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
    refresh();
  } catch (error) {
    console.log({ error });
    alert(error.statusMessage || error);
  }
}

</script>

<style></style>