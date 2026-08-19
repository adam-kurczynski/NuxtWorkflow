<template>
  <div class="flex flex-col gap-4">
    <div class="flex justify-between items-center">
      <p class="text-sm text-stone-400">
        Łącznie: <span class="font-bold text-stone-200">{{ workers?.length || 0 }}</span> pracowników
      </p>
      <UButton
        icon="i-material-symbols-add-2"
        @click="addWorker"
      >
        Dodaj pracownika
      </UButton>
    </div>

    <div v-if="error">
      <UCard class="border-red-900/50 text-center py-6">
        <p class="text-red-400 text-sm">Wystąpił błąd podczas pobierania danych</p>
      </UCard>
    </div>

    <div v-else-if="workers && workers.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="worker in workers" :key="worker.id" class="hover:border-stone-700 transition-colors">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center font-bold text-primary shrink-0">
            {{ (worker.name || worker.username || 'P').charAt(0).toUpperCase() }}
          </div>
          <div class="flex flex-col min-w-0 flex-1">
            <h1 class="text-base font-bold text-stone-100 truncate">{{ worker.name }}</h1>
            <p class="text-xs text-stone-400 truncate">{{ worker.email }}</p>
            <div class="mt-2">
              <UBadge :label="worker.role === 'admin' ? 'Administrator' : 'Pracownik'" :color="worker.role === 'admin' ? 'primary' : 'neutral'" variant="subtle" size="xs" />
            </div>
          </div>
        </div>
      </UCard>
    </div>

    <UCard v-else class="text-center py-8 border-dashed border-stone-800">
      <p class="text-stone-400 text-sm">Brak pracowników do wyświetlenia</p>
    </UCard>

    <UModal v-model:open="isOpen" fullscreen title="Dodaj pracownika">
      <template #body>
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
          <UFormField label="Imię i nazwisko" name="name" required>
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Email" name="email" required>
            <UInput v-model="state.email" type="email" class="w-full" />
          </UFormField>
          <UFormField label="Hasło tymczasowe" name="password" required>
            <UInput v-model="state.password" type="password" class="w-full" />
          </UFormField>
          <UFormField label="Powtórz hasło" name="confirmPassword" required>
            <UInput v-model="state.confirmPassword" type="password" class="w-full" />
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
import { object, string, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";


definePageMeta({
  title: "Pracownicy",
  description: "Pracownicy",
  middleware: ["auth"],
  colorMode: 'dark'
})


const { data: workers, error, refresh } = useFetch<User[]>('/api/users');

const isOpen = ref(false);
const state = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const schema = object({
  name: string().required("Pole wymagane"),
  email: string().email("Niepoprawny email").required("Pole wymagane"),
  password: string().required("Pole wymagane"),
  confirmPassword: string().oneOf([yupRef('password')], 'Hasła muszą być takie same').required("Pole wymagane")
});

type Schema = InferType<typeof schema>;

const addWorker = () => {
  isOpen.value = true;
  clearForm();
}

const clearForm = () => {
  state.name = '';
  state.email = '';
}

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  event.preventDefault();
  await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: state.name,
      email: state.email,
      password: state.password,
      avatar: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      username: state.name,
      role: 'user'
    })
  });
  refresh();
  isOpen.value = false;
  clearForm();
}

</script>

<style></style>