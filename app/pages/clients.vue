<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
      <UInput v-model="search" placeholder="Szukaj klienta..." class="flex-1" icon="i-material-symbols-search" />
      <UButton
        icon="i-material-symbols-add-2"
        class="shrink-0 justify-center"
        @click="isOpen = true"
      >
        Dodaj klienta
      </UButton>
    </div>

    <div v-if="data && data.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="client in data" :key="client.id" class="flex flex-col justify-between hover:border-stone-700 transition-colors">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols-person-4-outline-rounded" class="text-primary text-xl shrink-0" />
            <h1 class="font-bold text-base text-stone-100">{{ client.name }}</h1>
          </div>
          <p v-if="client.address" class="text-xs text-stone-400 flex items-center gap-1.5">
            <UIcon name="i-material-symbols-location-on-outline-rounded" class="shrink-0" />
            {{ client.address }}
          </p>
          <p v-if="client.phone" class="text-xs text-stone-400 flex items-center gap-1.5">
            <UIcon name="i-material-symbols-call-outline-rounded" class="shrink-0" />
            {{ client.phone }}
          </p>
        </div>
      </UCard>
    </div>

    <UCard v-else class="text-center py-8 border-dashed border-stone-800">
      <p class="text-stone-400 text-sm">Brak klientów do wyświetlenia</p>
    </UCard>

    <UModal v-model:open="isOpen" fullscreen class="p-4" title="Dodaj klienta">
      <template #body>
        <UForm :schema="schema" :state="state" @submit="createClient" class="space-y-4">
          <UFormField label="Nazwa" name="name" required>
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Adres" name="address" required>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";

definePageMeta({
  title: "Klienci",
  description: "Klienci",
  middleware: ["auth"],
  colorMode: 'dark'
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