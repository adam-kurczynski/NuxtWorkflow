<template>
  <div class="flex flex-col h-screen p-4">
    <AppHeader />
    <div class="pt-14 pb-32 flex gap-2 flex-col">
      <PageTitle :title="title" :description="description" />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const title = computed(() => {
  return useRoute().meta.title || "";
});
const description = computed(() => {
  return useRoute().meta.description || "";
});
</script>
