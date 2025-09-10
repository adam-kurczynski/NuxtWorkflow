<template>
  <UCard>
    <div class="flex items-center justify-between pb-4">
      <p>{{ title }}</p>
      <UIcon :name="icon" class="text-stone-400" />
    </div>
    <div>
      <h1 class="font-bold text-2xl">{{ bold }}</h1>
      <p v-if="description" class="text-stone-400 text-xs">
        {{ description }}
      </p>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface CardProps {
  title: string;
  bold: number | string;
  description: string;
  icon: string;
}

const { title, bold, description, icon } = defineProps<CardProps>();
</script>
