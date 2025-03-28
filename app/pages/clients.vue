<template>
  <UInput v-model="search" placeholder="Szukaj" />
  <UCard v-for="client in data" :key="client.id" class="mb-2">
    <p>{{ client.name }}</p>
    <p>{{ client.address }}</p>
    <p>{{ client.phone }}</p>
  </UCard>

  <UModal v-model:open="isOpen" fullscreen class="p-4" title="Dodaj klienta">
    <UButton icon="i-material-symbols-add-2"
      class="fixed z-50 bottom-24 right-8 w-12 h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]" />
    <template #body>
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Nazwa" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField label="Adres" name="address">
          <UInput v-model="state.address" class="w-full" />
        </UFormField>
        <UFormField label="Telefon" name="phone">
          <UInput v-model="state.phone" class="w-full" />
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
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  title: "Klienci",
  description: "Klienci",
  middleware: ["auth"],
})


const isOpen = ref(false);
const search = ref("");
const toast = useToast();
const { data, refresh } = await useFetch("/api/clients", {
  query: {
    search: search
  }
});

const schema = object({
  name: string().required("Pole wymagane"),
  address: string().required("Pole wymagane"),
  phone: string().required("Pole wymagane")
})

type Schema = InferType<typeof schema>;

const state = reactive({
  name: undefined,
  address: undefined,
  phone: undefined
})

const onSubmit = async (event: FormSubmitEvent<Schema>) => {

  try {
    await $fetch("/api/clients", {
      method: "POST",
      body: event.data
    });
    isOpen.value = false;
    refresh();
    toast.add({
      title: "Dodano klienta",
      color: "success"
    })
  } catch (error) {
    toast.add({
      title: "Nie udało się dodać klienta",
      color: "error"
    })

  }
}

</script>

<style></style>