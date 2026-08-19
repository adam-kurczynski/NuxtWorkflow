<template>
  <div class="flex flex-col gap-1 pb-1">
    <h1 class="text-2xl font-bold tracking-tight text-zinc-100 sm:text-3xl">
      {{ title }}
    </h1>
    <p v-if="description" class="text-sm text-zinc-400 font-normal">
      {{ description }}
    </p>
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
