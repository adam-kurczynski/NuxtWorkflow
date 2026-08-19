<template>
  <div class="flex flex-col gap-6">
    <UCard>
      <div class="flex justify-between items-center pb-4 mb-4 border-b border-stone-800">
        <span class="text-sm font-semibold text-stone-200">Filtruj czasy pracy</span>
        <USwitch
          :loading="isLoading"
          v-on:update:model-value="onSwitchChange"
          size="sm"
          v-model="switchEnabled"
          label="Wyłącz ograniczenia logowania"
        />
      </div>

      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>
        <div class="flex justify-end pt-2">
          <UButton type="submit" icon="i-material-symbols-search" class="px-6 justify-center">
            Wyszukaj
          </UButton>
        </div>
      </UForm>
    </UCard>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <BasicInfoCard
        title="Łączna suma godzin"
        :bold="parseDecimalToTime(countLoggedTime(timesheets || 0))"
        description="Suma dla wybranych filtrów"
        icon="i-material-symbols-calendar-clock-outline-rounded"
      />
      <BasicInfoCard
        title="Liczba wpisów"
        :bold="timesheets?.length || 0"
        description="Zalogowanych pozycji czasu"
        icon="i-material-symbols-list-alt-rounded"
      />
    </div>

    <div v-if="timesheets && timesheets.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <UCard v-for="log in timesheets" :key="log.user_timelog.id" class="hover:border-stone-700 transition-colors">
        <div class="flex justify-between items-start gap-3">
          <div class="flex flex-col gap-1">
            <h1 class="text-base font-bold text-stone-100">{{ log.users?.name }}</h1>
            <UBadge v-if="log.projects?.name" variant="subtle" color="primary" class="w-fit">
              {{ log.projects?.name }}
            </UBadge>
          </div>
          <div class="text-right flex flex-col items-end gap-1">
            <span class="text-xs font-semibold text-stone-300">{{ formatDate(log.user_timelog.startTime) }}</span>
            <span class="text-xs text-stone-400">
              {{
                formatTime(log.user_timelog.startTime) +
                " - " +
                formatTime(log.user_timelog.endTime)
              }}
            </span>
            <span class="text-xs font-bold text-primary">
              {{ parseDecimalToTime(countLoggedTime(log)) }}
            </span>
          </div>
        </div>
      </UCard>
    </div>
    <UCard v-else class="text-center py-8 border-dashed border-stone-800">
      <p class="text-stone-400 text-sm">Brak zalogowanych godzin dla wybranych kryteriów</p>
    </UCard>
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
  startTime: getFirstAndLastDay(new Date()).firstDayFormatted,
  endTime: getFirstAndLastDay(new Date()).lastDayFormatted,
  projectId: 0,
  userId: 0,
});

const getURL = computed(
  () =>
    `api/timesheet?startTime=${
      state.startTime ? `${state.startTime}T00:00:00` : ""
    }&endTime=${
      state.endTime ? `${state.endTime}T23:59:59` : ""
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
