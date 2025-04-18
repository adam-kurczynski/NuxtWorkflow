<template>
  <UInput v-model="search" placeholder="Szukaj" />
  <UCard v-for="client in data" :key="client.id" class="mb-2">
    <p>{{ client.name }}</p>
    <p>{{ client.address }}</p>
    <p>{{ client.phone }}</p>
  </UCard>

  <UModal v-model:open="isOpen" fullscreen class="p-4" title="Dodaj klienta">
    <AddFormButton />
    <template #body>
      <UForm :schema="schema" :state="state" @submit="createClient" class="space-y-4">
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

definePageMeta({
  title: "Klienci",
  description: "Klienci",
  middleware: ["auth"],
})

const isOpen = ref(false);

const state = reactive({
  name: '',
  address: '',
  phone: ''
})

const onSuccessfulSubmit = () => {
  isOpen.value = false;
  state.name = '';
  state.address = '';
  state.phone = '';
  refresh()
}

const { data, search, createClient, refresh, schema } = useClients(onSuccessfulSubmit);



</script>

<style></style>