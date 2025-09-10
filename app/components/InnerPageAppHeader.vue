<template>
  <header
    class="z-10 h-12 p-2 flex justify-center items-center fixed top-0 left-0 w-full mb-2 bg-stone-950 border-b-1"
  >
    <div class="absolute top-2 left-2">
      <UButton
        variant="ghost"
        trailing-icon="i-material-symbols-arrow-back"
        @click="goBack"
      />
    </div>
    <h1 class="text-xl font-bold">Workflow</h1>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const goBack = () => {
  router.back();
};
</script>
