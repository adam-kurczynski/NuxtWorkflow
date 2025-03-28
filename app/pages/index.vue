<template>
  <main>
    <div class="flex flex-col items-center space-y-4 p-2">
      <p>W tym miesiącu zalogowałeś {{ parseDecimalToTime(countLoggedTime(data)) }}</p>
      <UProgress :value="countLoggedTime(data) / 160 * 100" />
      <UButton @click="isOpen = true">Dodaj dzisiejszy czas</UButton>
      <UModal v-model="isOpen" fullscreen>
        <div class="p-4">
          <div class="flex items-center justify-between ">
            <h1 class="text-2xl font-bold">Dodaj Czas</h1>
            <UButton icon="i-material-symbols-cancel-outline-rounded" @click="isOpen = false"
              class="absolute top-4 right-4" />
          </div>
          <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
            <UFormGroup label="Projekt" name="projectId">
              <USelect v-if="projects" v-model="state.projectId" option-attribute="name" :options="projects.map(project => {
                return {
                  name: project.projects.name,
                  value: project.projects.id
                }
              })" />
            </UFormGroup>
            <UFormGroup label="Czas rozpoczęcia" name="startTime">
              <UInput v-model="state.startTime" type="time" />
            </UFormGroup>
            <UFormGroup label="Czas zakończenia" name="endTime">
              <UInput v-model="state.endTime" type="time" />
            </UFormGroup>
            <UButton type="submit" class="w-full flex-row justify-center">
              Dodaj
            </UButton>
          </UForm>
        </div>
      </UModal>
    </div>
  </main>
</template>

<script setup lang="ts">

import { ref, reactive } from "vue";
import countLoggedTime from "~~/utils/countLoggedTime";
import getFirstAndLastDay from '~~/utils/getFirstAndLastDay';
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import buildTodayDate from "~~/utils/buildTodayDate";
import parseDecimalToTime from "~~/utils/parseDecimalToTime";
import type { TimelogResponse } from "~~/server/api/types";

definePageMeta({
  title: "Home",
  description: "Dashboard page",
  name: "dashboard",
  layout: "default",
  middleware: "auth"
})

const { user } = useUserSession();

type Schema = InferType<typeof schema>;


const { data, refresh } = await useFetch(`/api/timesheet?startTime=${getFirstAndLastDay(new Date).firstDay}&endTime=${getFirstAndLastDay(new Date).lastDay}&userId=${user.value.id}`);
const { data: projects } = await useFetch("/api/projects");

const isOpen = ref(false);

const state = reactive({
  projectId: undefined,
  startTime: '07:00',
  endTime: '17:00'
});

const schema = object({
  projectId: number().required("Pole wymagane"),
  startTime: string().required("Pole wymagane"),
  endTime: string().required("Pole wymagane"),
});

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!user.value) {
    return;
  }
  try {
    await $fetch("/api/timesheet", {
      method: "POST",
      body: {
        startTime: buildTodayDate(event.data.startTime),
        endTime: buildTodayDate(event.data.endTime),
        projectId: event.data.projectId,
        userId: user.value.id
      }
    });
    isOpen.value = false;
    refresh();
  } catch (error) {
    alert(error.statusMessage || error);
  }
};

</script>