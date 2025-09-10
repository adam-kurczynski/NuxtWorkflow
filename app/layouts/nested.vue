<template>
  <div class="flex flex-col h-screen p-4">
    <div class="pt-14 pb-32 flex gap-2 flex-col">
      <InnerPageAppHeader />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts"></script>
