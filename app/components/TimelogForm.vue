<template>
  <div class="p-4">
    <UForm
      :schema="schema"
      :state="state"
      @submit="onSubmit"
      class="space-y-4 flex justify-center flex-col"
    >
      <UFormField label="Projekt" name="projectId">
        <USelect
          class="w-full"
          placeholder="Wybierz projekt"
          v-if="projects"
          v-model="state.projectId"
          option-attribute="name"
          :items="
            projects.map((project) => {
              return {
                label: project.projects.name,
                value: project.projects.id,
              };
            })
          "
        />
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

<script setup lang="ts">
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import buildTodayDate from "~~/utils/buildTodayDate";

const { data: projects } = await useFetch("/api/projects");

const state = reactive({
  projectId: undefined,
  startTime: "07:00",
  endTime: "17:00",
});

const { user } = useUserSession();

const schema = object({
  projectId: number().required("Pole wymagane"),
  startTime: string().required("Pole wymagane"),
  endTime: string().required("Pole wymagane"),
});

type Schema = InferType<typeof schema>;

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
        userId: user.value.id,
      },
    });
  } catch (error) {
    alert(error.statusMessage || error);
  }
};
</script>
