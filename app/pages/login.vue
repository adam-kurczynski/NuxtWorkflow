<template>
  <div class="flex justify-center items-center h-screen flex-col">
    <h1 class="text-4xl font-bold p-10">Workflow</h1>
    <UCard class="w-96">
      <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

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

if (user.value) {
  router.push("/");
}

import { object, string } from 'yup'


const state = reactive({
  username: undefined,
  password: undefined
})

const loading = ref(false);


const schema = object({
  username: string().required('Required'),
  password: string()
    .min(4, 'Must be at least 4 characters')
    .required('Required')
})


async function onSubmit(event) {
  const body = event.data;
  loading.value = true;

  $fetch('/api/login', {
    method: 'POST',
    body
  })
    .then(async () => {
      // Refresh the session on client-side and redirect to the home page
      await refreshSession()
      await router.replace('/')
    })
    .catch(() => {
      alert('Bad credentials')
      loading.value = false
    })

}
</script>
