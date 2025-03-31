<template>
  <div>
    <UButton icon="i-material-symbols-add-2" @click="emit('click')"
      :class="`${text ? 'w-36' : 'w-12'} fixed z-50 bottom-18 inset-x-0 mx-auto h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]`">
      {{ text }}
    </UButton>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  text: String
});

const emit = defineEmits(["click"]);

</script>

<style></style>