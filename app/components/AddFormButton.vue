<template>
  <div>
    <UButton
      icon="i-material-symbols-add-2"
      @click="emit('click')"
      :class="`${
        text ? 'w-36' : 'w-12'
      } fixed z-50 bottom-18 inset-x-0 mx-auto h-12 flex justify-center`"
    >
      {{ text }}
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const { text } = defineProps({
  text: String,
});

const emit = defineEmits(["click"]);
</script>

<style></style>
