<template>
  <div class="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col relative selection:bg-emerald-500/20 selection:text-emerald-300">
    <!-- Ambient top glow -->
    <div class="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(16,185,129,0.06),rgba(255,255,255,0))]"></div>
    <AppHeader />
    <main class="relative flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 flex flex-col gap-6">
      <PageTitle :title="title" :description="description" />
      <slot />
    </main>
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
