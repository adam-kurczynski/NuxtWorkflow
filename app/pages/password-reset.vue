<template>
  <div class="flex-col flex gap-2 p-2">
    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormGroup label="Aktualne hasło" name="oldPassword">
        <UInput type="password" v-model="state.oldPassword" />
      </UFormGroup>
      <UFormGroup label="Nowe hasło" name="newPassword">
        <UInput type="password" v-model="state.newPassword" />
      </UFormGroup>
      <UFormGroup label="Powtórz nowe hasło" name="confirmPassword">
        <UInput type="password" v-model="state.confirmPassword" />
      </UFormGroup>
      <UButton class="w-full flex justify-center" type="submit">Zmień hasło</UButton>
    </UForm>
  </div>
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
  confirmPassword: ''
})

const schema = object({
  oldPassword: string().required('Required'),
  newPassword: string().required('Required').min(6, 'Hasło musi mieć co najmniej 6 znaków'),
  confirmPassword: string().oneOf([yupRef('newPassword')], 'Hasła muszą być takie same').required("Pole wymagane")
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
        id: user.value.id
      })
    })
    Toast.add({
      title: 'Hasło zmienione',
      description: 'Hasło zostało zmienione',
      color: 'emerald'
    })
  } catch (error) {
    Toast.add({
      title: 'Wystąpił błąd',
      description: 'Błąd podczas zmiany hasła',
      color: 'rose'
    })
    // Optionally, handle the error in the UI, e.g., show a notification
  }
}



</script>

<style></style>