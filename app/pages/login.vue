<template>
  <div class="flex justify-center items-center h-screen flex-col w-full p-4">
    <h1 class="text-4xl font-bold p-10">Workflow</h1>
    <UCard class="w-full p-4 flex justify-center bg-black/10">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormField label="Username" name="username">
          <UInput v-model="state.username" class="w-full" />
        </UFormField>

        <UFormField label="Password" name="password">
          <UInput v-model="state.password" :type="show ? 'text' : 'password'" :ui="{ trailing: 'pe-1' }" class="w-full">
            <template #trailing>
              <UButton color="neutral" variant="link" size="sm"
                :icon="show ? 'i-material-symbols-visibility-off-outline-rounded' : 'i-material-symbols-visibility-outline-rounded'"
                :aria-label="show ? 'Hide password' : 'Show password'" :aria-pressed="show" aria-controls="password"
                @click="show = !show" />
            </template>
          </UInput>
        </UFormField>


        <UButton type="submit" :loading="loading" class="w-full flex-row justify-center">
          Login
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup>

definePageMeta({
  title: "Login",
  description: "Login page",
  name: "login",
  layout: "blank"
})

const { user, fetch: refreshSession } = useUserSession();
const router = useRouter();
const toast = useToast();

if (user.value) {
  router.push("/");
}

import { object, string } from 'yup'

const show = ref(false);
const state = reactive({
  username: undefined,
  password: undefined
})

const loading = ref(false);


const schema = object({
  username: string().required('Pole wymagane'),
  password: string()
    .required('Pole wymagane')
})


async function onSubmit(event) {
  const body = event.data;
  loading.value = true;
  $fetch('/api/auth/login', {
    method: 'POST',
    body
  })
    .then(async () => {
      // Refresh the session on client-side and redirect to the home page
      await refreshSession()
      await router.replace('/')
    })
    .catch(() => {
      toast.add({
        title: 'Błąd',
        description: 'Niepoprawne dane logowania',
        color: 'error'
      })
      loading.value = false
    })

}
</script>
