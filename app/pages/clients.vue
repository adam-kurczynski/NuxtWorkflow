<template>
  <div class="p-2">
    <UCard v-for="client in data" :key="client.id" class="mb-2">
      <p>{{ client.name }}</p>
      <p>{{ client.address }}</p>
      <p>{{ client.phone }}</p>
    </UCard>
    <UButton icon="i-material-symbols-add-2" @click="isOpen = true"
      class="fixed bottom-24 right-8 w-12 h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]" />
    <UModal v-model="isOpen">
      <div class="p-4">
        <h1 class="text-2xl font-bold">Dodaj Klienta</h1>
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
          <UFormGroup label="Nazwa" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Adres" name="address">
            <UInput v-model="state.address" />
          </UFormGroup>
          <UFormGroup label="Telefon" name="phone">
            <UInput v-model="state.phone" />
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
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
const { data, refresh } = await useFetch("/api/clients");
const isOpen = ref(false);

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
  console.log("onSubmit", event.data);
  try {
    await $fetch("/api/clients", {
      method: "POST",
      body: event.data
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