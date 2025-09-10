<template>
  <div class="w-full p-2 fle justify-center flex-col gap-2">
    <USwitch
      :loading="isLoading"
      v-on:update:model-value="onSwitchChange"
      size="xl"
      v-model="switchEnabled"
      label="Wyłącz ograniczenia w logowaniu godzin"
      class="mb-4"
    />
    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormField label="Data od" name="startTime">
        <UInput v-model="state.startTime" type="date" class="w-full" />
      </UFormField>
      <UFormField label="Data do" name="endTime">
        <UInput v-model="state.endTime" type="date" class="w-full" />
      </UFormField>
      <UFormField label="Projekt" name="projectId">
        <USelect
          v-if="projects"
          placeholder="Wybierz projekt"
          class="w-full"
          v-model="state.projectId"
          option-attribute="name"
          :items="
            addEmptyValue(
              'Wszystkie',
              projects.map((project) => {
                return {
                  label: project.projects.name,
                  value: project.projects.id,
                };
              })
            )
          "
        />
      </UFormField>
      <UFormField label="Pracownik" name="userId">
        <USelect
          v-if="users"
          class="w-full"
          placeholder="Wybierz pracownika"
          v-model="state.userId"
          option-attribute="name"
          :items="
            addEmptyValue(
              'Wszyscy',
              users.map((user) => {
                return {
                  label: user.name,
                  value: user.id,
                };
              })
            )
          "
        />
      </UFormField>
      <UButton type="submit" class="w-full flex-row justify-center">
        Wyszukaj
      </UButton>
    </UForm>
    <div class="flex justify-center items-center p-2">
      <h1 class="text-xl font-bold">
        Suma godzin: {{ parseDecimalToTime(countLoggedTime(timesheets || 0)) }}
      </h1>
    </div>
    <div class="flex flex-col gap-2 pb-4">
      <UCard v-for="log in timesheets" :key="log.user_timelog.id">
        <div class="flex justify-between">
          <div>
            <h1 class="text-xl font-bold">{{ log.users?.name }}</h1>
            <p>{{ log.projects?.name }}</p>
          </div>
          <div>
            <p>{{ formatDate(log.user_timelog.startTime) }}</p>
            <p>
              {{
                formatTime(log.user_timelog.startTime) +
                " - " +
                formatTime(log.user_timelog.endTime)
              }}
            </p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import getFirstAndLastDay from "~~/utils/getFirstAndLastDay";
import type { TimelogResponse } from "~~/server/api/types";
import formatDate from "~~/utils/formatDate";
import formatTime from "~~/utils/formatTime";
import countLoggedTime from "~~/utils/countLoggedTime";
import parseDecimalToTime from "~~/utils/parseDecimalToTime";

definePageMeta({
  title: "Zalogowane godziny",
  description: "Zalogowane godziny",
  middleware: "admin",
  colorMode: "dark",
});

const toast = useToast();
const { data: projects } = await useFetch("/api/projects");
const { data: users } = await useFetch("/api/users");

const { data: isLoggingRestrictionDisabled, refresh: refreshRestriction } =
  useFetch<Boolean>("/api/config", {
    onResponse({ response }) {
      switchEnabled.value = response._data;
      isLoading.value = false;
    },
  });

const isLoading = ref(false);
const switchEnabled = ref(false as boolean);

const state = reactive({
  startTime: getFirstAndLastDay(new Date()).firstDay.split("T")[0],
  endTime: getFirstAndLastDay(new Date()).lastDay.split("T")[0],
  projectId: 0,
  userId: 0,
});

const getURL = computed(
  () =>
    `api/timesheet?startTime=${
      state.startTime ? new Date(state.startTime).toISOString() : ""
    }&endTime=${
      state.endTime ? new Date(state.endTime).toISOString() : ""
    }&projectId=${state.projectId ? state.projectId : ""}&userId=${
      state.userId ? state.userId : ""
    }`
);

const { data: timesheets, refresh } = await useFetch<TimelogResponse[]>(
  getURL,
  {
    immediate: false,
    watch: false,
  }
);

const schema = object({
  startTime: string().required("Pole wymagane"),
  endTime: string().required("Pole wymagane"),
  projectId: number().required("Pole wymagane"),
  userId: number().required("Pole wymagane"),
});

type Schema = InferType<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  refresh();
};

const addEmptyValue = (name: string, list: any[]) => {
  return [{ label: name, value: 0 }, ...list];
};

const onSwitchChange = async (value: boolean) => {
  isLoading.value = true;
  try {
    await $fetch("/api/config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enable: value,
      }),
    });
    isLoading.value = false;
  } catch (error) {
    refreshRestriction();
    toast.add({
      title: "Wystąpił błąd",
    });
  }
};
</script>

<style></style>
