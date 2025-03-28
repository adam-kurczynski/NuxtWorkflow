<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
    <UFormField label="Email" name="email">
      <UInput type="email" v-model="state.email" class="w-full" />
    </UFormField>
    <UFormField label="Aktualne hasło" name="oldPassword">
      <UInput type="password" v-model="state.oldPassword" class="w-full" />
    </UFormField>
    <UFormField label="Nowe hasło" name="newPassword">
      <UInput type="password" v-model="state.newPassword" class="w-full" />
    </UFormField>
    <UFormField label="Powtórz nowe hasło" name="confirmPassword">
      <UInput type="password" v-model="state.confirmPassword" class="w-full" />
    </UFormField>
    <UButton class="w-full flex justify-center" type="submit">Zmień hasło</UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { object, string, type InferType, ref as yupRef } from 'yup'
import type { FormSubmitEvent } from '#ui/types'


definePageMeta({
  title: "Reset hasła",
  description: "Reset hasła",
  middleware: ["auth"],
})

const { user } = useUserSession()
const Toast = useToast()

const state = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
  email: user.value?.email || ''
})

const schema = object({
  oldPassword: string().required('Pole wymagane'),
  newPassword: string().required('Pole wymagane').min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  confirmPassword: string().oneOf([yupRef('newPassword')], 'Hasła muszą być takie same').required("Pole wymagane"),
  email: string().email('Niepoprawny adres email').required('Pole wymagane')
})

type Schema = InferType<typeof schema>

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  event.preventDefault()
  //return when user.value.id is not defined
  if (user.value === null) return
  const body = event.data
  try {
    await $fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify({
        oldPassword: body.oldPassword,
        newPassword: body.newPassword,
        id: user.value.id,
        email: body.email
      })
    })
    Toast.add({
      title: 'Hasło zmienione',
      description: 'Hasło zostało zmienione',
      color: 'success'
    })
  } catch (error) {
    Toast.add({
      title: 'Wystąpił błąd',
      description: 'Błąd podczas zmiany hasła',
      color: 'error'
    })
    // Optionally, handle the error in the UI, e.g., show a notification
  }
}



</script>

<style></style>