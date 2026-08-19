<template>
  <header
    class="z-20 h-14 fixed top-0 left-0 w-full bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/80"
  >
    <div class="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <UButton
          variant="ghost"
          icon="i-material-symbols-arrow-back"
          @click="goBack"
          class="text-zinc-300 hover:text-white"
        />
        <NuxtLink to="/" class="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950/30">
            <UIcon name="i-material-symbols-grid-view-rounded" class="text-lg" />
          </div>
          <h1 class="text-base font-bold tracking-tight text-zinc-100">Workflow</h1>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.back();
};
</script>
