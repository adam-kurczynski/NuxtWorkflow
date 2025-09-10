<template>
  <div class="flex flex-col items-center gap-2">
    <UModal v-model:open="isOpen" fullscreen title="Dodaj urlop">
      <UButton
        icon="i-material-symbols-timer-off-outline-rounded"
        @click="isOpen = true"
      >
        Dodaj urlop
      </UButton>
      <template #body>
        <div class="p-4">
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormField required label="Data rozpoczęcia" name="startTime">
              <UInput v-model="state.startTime" type="date" class="w-full" />
            </UFormField>
            <UFormField required label="Data zakończenia" name="endTime">
              <UInput v-model="state.endTime" type="date" class="w-full" />
            </UFormField>
            <UButton type="submit" class="w-full flex-row justify-center">
              Dodaj
            </UButton>
          </UForm>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
const emits = defineEmits(["submit"]);
const onSuccessfulSubmit = () => {
  emits("submit");
};

const { state, schema, isOpen, onSubmit } = useTimeOff(onSuccessfulSubmit);
</script>

<style></style>
