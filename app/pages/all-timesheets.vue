<template>
  <div class="w-full p-2 fle justify-center flex-col gap-2">
    <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormGroup label="Data od" name="startTime">
        <UInput v-model="state.startTime" type="date" />
      </UFormGroup>
      <UFormGroup label="Data do" name="endTime">
        <UInput v-model="state.endTime" type="date" />
      </UFormGroup>
      <UFormGroup label="Projekt" name="projectId">
        <USelect v-if="projects" placeholder="Wybierz projekt" v-model="state.projectId" option-attribute="name"
          :options="addEmptyValue('Wszystkie',
            projects.map(project => {
              return {
                name: project.projects.name,
                value: project.projects.id
              }
            })
          )" />
      </UFormGroup>
      <UFormGroup label="Pracownik" name="userId">
        <USelect v-if="users" placeholder="Wybierz pracownika" v-model="state.userId" option-attribute="name" :options="addEmptyValue('Wszyscy',
          users.map(user => {
            return {
              name: user.name,
              value: user.id
            }
          }))" />
      </UFormGroup>
      <UButton type="submit" class="w-full flex-row justify-center">
        Wyszukaj
      </UButton>
    </UForm>
    <div class="flex justify-center items-center p-2">
      <h1 class="text-xl font-bold">Suma godzin: {{ parseDecimalToTime(countLoggedTime(timesheets || 0)) }}</h1>
    </div>
    <div class="flex flex-col gap-2 pb-4">
      <UCard v-for="log in timesheets" :key="log.user_timelog.id">
        <div class="flex justify-between">
          <div>
            <h1 class="text-xl font-bold">{{ log.users?.name }}</h1>
            <p>{{ log.projects?.name }}</p>
          </div>
          <div>
            <p>{{ formatDateTime(log.user_timelog.startTime) }}</p>
            <p>{{ formatDateTime(log.user_timelog.endTime) }}</p>
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
import formatDateTime from "~~/utils/formatDateTime";
import countLoggedTime from "~~/utils/countLoggedTime";
import parseDecimalToTime from "~~/utils/parseDecimalToTime";

const { data: projects } = await useFetch("/api/projects");
const { data: users } = await useFetch("/api/users");

const state = reactive({
  startTime: getFirstAndLastDay(new Date()).firstDay.split('T')[0],
  endTime: getFirstAndLastDay(new Date()).lastDay.split('T')[0],
  projectId: undefined,
  userId: undefined
});

const getURL = computed(() => `api/timesheet?startTime=${state.startTime ? new Date(state.startTime).toISOString() : ''}&endTime=${state.endTime ? new Date(state.endTime).toISOString() : ''}&projectId=${state.projectId ? state.projectId : ''}&userId=${state.userId ? state.userId : ''}`)

const { data: timesheets, refresh } = await useFetch<TimelogResponse[]>(getURL, {
  immediate: false,
  watch: false,
});

const schema = object({
  startTime: string().required("Pole wymagane"),
  endTime: string().required("Pole wymagane"),
  projectId: number().required("Pole wymagane"),
  userId: number().required("Pole wymagane")
});




type Schema = InferType<typeof schema>;



const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  refresh().then(() => {
    console.log(timesheets)
  })
}

const addEmptyValue = (name: string, list: any[]) => {
  return [{ name, value: 0 }, ...list]
}

</script>

<style></style>