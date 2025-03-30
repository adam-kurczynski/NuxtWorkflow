<template>
  <div class="flex flex-col items-center gap-2">
    <UModal v-model:open="isOpen" fullscreen title="Dodaj urlop">
      <UButton
        class="bottom-42 fixed z-50 right-8 w-36 h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]"
        icon="i-material-symbols-timer-off-outline-rounded">
        Dodaj urlop
      </UButton>
      <template #body>
        <div class="p-4">
          <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
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
import { object, date, ref as yupRef, string } from 'yup';
import type { FormSubmitEvent } from '#ui/types';

const toast = useToast();

interface TimeOffForm {
  startTime: string;
  endTime: string;
}

const { user } = useUserSession();

const isOpen = ref(false);
const state = reactive({
  startTime: '',
  endTime: ''
});

const schema = object({
  startTime: string().required("Pole wymagane"),
  endTime: string().required("Pole wymagane")
});

const emits = defineEmits(['submit']);

const onSubmit = async (event: FormSubmitEvent<TimeOffForm>) => {
  event.preventDefault();
  if (user.value === null) return;
  const { startTime, endTime } = event.data;
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  if (startDate > endDate) {
    toast.add({
      title: 'Data zakończenia musi być późniejsza niż data rozpoczęcia',
      color: 'error'
    });
    return;
  }
  if (startDate < new Date()) {
    toast.add({
      title: 'Data rozpoczęcia nie może być wcześniejsza niż dzisiaj',
      color: 'error'
    });
    return;
  }
  if (endDate < new Date()) {
    toast.add({
      title: 'Data zakończenia nie może być wcześniejsza niż dzisiaj',
      color: 'error'
    });
    return;
  }
  try {
    await $fetch('/api/time-off', {
      method: 'POST',
      body: {
        startTime: startDate,
        endTime: endDate,
        userId: user.value.id
      }
    });
    toast.add({
      title: 'Urlop dodany pomyślnie',
      color: 'success'
    });
    isOpen.value = false;
    emits('submit');
  } catch (error) {
    console.error(error);
    toast.add({
      title: error.statusMessage || 'Nie udało się dodać urlopu',
      color: 'error'
    });
  }
};






</script>

<style></style>