<template>
  <div class="flex-col flex gap-2 p-2">
    <UButton @click="goToTimesheet" variant="outline" icon="i-material-symbols-alarm-outline-rounded" size="xl"
      class="gallery-item">Czasy
      pracy</UButton>
    <UButton @click="goToMaterials" variant="outline" icon="i-material-symbols-assignment-outline-rounded" size="xl"
      class="gallery-item">
      Materiały
    </UButton>
    <UButton @click="goToEmployees" variant="outline" icon="i-material-symbols-user-attributes-outline-rounded"
      size="xl" class="gallery-item">
      Pracownicy
    </UButton>
    <UButton @click="goToPasswordReset" variant="outline" icon="i-material-symbols-key-vertical-outline-rounded"
      size="xl" class="gallery-item">
      Zmiana hasła
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();

const goToTimesheet = () => {
  router.push({ name: 'all-timesheets' });
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