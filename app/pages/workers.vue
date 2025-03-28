<template>
  <div v-if="error">
    <p>Wystąpił błąd podczas pobierania danych</p>
  </div>
  <div v-else class="flex flex-col gap-2">
    <UCard v-for="worker in workers" :key="worker.id">
      <div class="flex justify-between flex-direction-row w-full">
        <div class="flex justify-between">
          <div>
            <h1 class="text-xl font-bold">{{ worker.name }}</h1>
            <p>{{ worker.email }}</p>
          </div>
        </div>
      </div>
    </UCard>
  </div>
  <UModal v-model:open="isOpen" fullscreen title="Dodaj pracownika">
    <UButton icon="i-material-symbols-add-2" @click="addWorker"
      class="fixed z-50 bottom-24 right-8 w-12 h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]" />
    <template #body>

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Imię i nazwisko" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField label="Email" name="email">
          <UInput v-model="state.email" class="w-full" />
        </UFormField>
        <UFormField label="Hasło tymczasowe" name="password">
          <UInput v-model="state.password" type="password" class="w-full" />
        </UFormField>
        <UFormField label="Powtórz hasło" name="confirmPassword">
          <UInput v-model="state.confirmPassword" type="password" class="w-full" />
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
import { object, string, ref as yupRef, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";


definePageMeta({
  title: "Pracownicy",
  description: "Pracownicy",
  middleware: ["auth"],
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