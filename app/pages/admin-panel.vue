<template>
  <div class="flex-col flex gap-2 p-2">
    <UButton v-if="isAdmin" @click="goToTimesheet" variant="outline" icon="i-material-symbols-alarm-outline-rounded"
      size="xl" class="gallery-item">Czasy
      pracy</UButton>
    <UButton @click="goToMaterials" variant="outline" icon="i-material-symbols-assignment-outline-rounded" size="xl"
      class="gallery-item">
      Materiały
    </UButton>
    <UButton v-if="isAdmin" @click="goToEmployees" variant="outline"
      icon="i-material-symbols-user-attributes-outline-rounded" size="xl" class="gallery-item">
      Pracownicy
    </UButton>
    <UButton @click="goToPasswordReset" variant="outline" icon="i-material-symbols-key-vertical-outline-rounded"
      size="xl" class="gallery-item">
      Zmiana hasła
    </UButton>
    <UButton @click="goToTimeoffs" variant="outline" icon="i-material-symbols-timer-off-outline-rounded"
      size="xl" class="gallery-item">
      Urlopy
    </UButton>
  </div>
</template>

<script lang="ts" setup>

definePageMeta({
  title: 'Konfiguracja',
  description: 'Panel administracyjny',
  middleware: 'auth',
})

const { user } = useUserSession();
const isAdmin = user.value?.role === "admin";
const router = useRouter();
const { data: isLoggingRestrictionDisabled} = useFetch<Boolean>('api/config')
const goToTimesheet = () => {
  router.push({ name: 'all-timesheets' });
}

const goToTimeoffs = () => {
  router.push({name: 'timeoffs'})
}

const goToMaterials = () => {
  router.push({ name: 'materials' });
}

const goToEmployees = () => {
  router.push({ name: 'workers' });
}

const goToPasswordReset = () => {
  router.push({ name: 'password-reset' });
}

</script>

<style>
.gallery-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;
}
</style>