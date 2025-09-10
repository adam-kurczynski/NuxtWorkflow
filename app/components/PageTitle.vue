<template>
  <div class="flex flex-col gap-1 mb-2">
    <h1 class="text-xl font-bold">{{ title }}</h1>
    <p v-if="description" class="text-sm text-stone-400">{{ description }}</p>
  </div>
</template>

<script setup>
const { title, description } = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
});
</script>
