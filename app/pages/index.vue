<template>
  <main>
    <div class="flex flex-col items-center space-y-4 p-2">
      <p>W tym miesiącu zalogowałeś {{ parseDecimalToTime(countLoggedTime(data)) }}</p>
      <UProgress v-model="loggedTime" />

      <UModal v-model:open="isOpen" fullscreen title="Dodaj godziny">
        <UButton>Dodaj dzisiejszy czas</UButton>
        <template #body>
          <div class="p-4">
            <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4 flex justify-center flex-col">
              <UFormField label="Projekt" name="projectId">
                <USelect class="w-full" placeholder="Wybierz projekt" v-if="projects" v-model="state.projectId"
                  option-attribute="name" :items="projects.map(project => {
                    return {
                      label: project.projects.name,
                      value: project.projects.id
                    }
                  })" />
              </UFormField>
              <UFormField label="Czas rozpoczęcia" name="startTime">
                <UInput class="w-full" v-model="state.startTime" type="time" />
              </UFormField>
              <UFormField label="Czas zakończenia" name="endTime">
                <UInput class="w-full" v-model="state.endTime" type="time" />
              </UFormField>
              <UButton type="submit" class="w-full flex-row justify-center">
                Dodaj
              </UButton>
            </UForm>
          </div>
        </template>
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
const isOpen = ref(false);

type Schema = InferType<typeof schema>;

const loggedTime = ref(0);
const { data, refresh } = await useFetch(`/api/timesheet?startTime=${getFirstAndLastDay(new Date).firstDay}&endTime=${getFirstAndLastDay(new Date).lastDay}&userId=${user.value.id}`, {
  onResponse({ request, response, options }) {
    if (response._data) {
      loggedTime.value = countLoggedTime(response._data) / 160 * 100;
    }
  }
});
const { data: projects } = await useFetch("/api/projects");

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