<template>
  <div
    class="relative group overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur hover:border-emerald-500/30 hover:bg-zinc-900/70 hover:shadow-lg hover:shadow-emerald-950/20 transition-all duration-200"
  >
    <div class="flex items-center justify-between gap-2 mb-3">
      <span class="text-xs font-medium uppercase tracking-wider text-zinc-400 truncate">{{ title }}</span>
      <div class="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/50 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 group-hover:text-emerald-300 transition-all shrink-0">
        <UIcon :name="icon" class="text-base" />
      </div>
    </div>
    <div class="flex flex-col gap-0.5">
      <h1 class="font-bold text-2xl tracking-tight text-zinc-100 font-mono">{{ bold }}</h1>
      <p v-if="description" class="text-zinc-400 text-xs truncate">
        {{ description }}
      </p>
    </div>
  </div>
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
