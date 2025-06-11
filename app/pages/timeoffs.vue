<template>
      <UFormField label="Pracownik" name="userId">
        <USelect onchange="refresh" v-if="users" class="w-full" placeholder="Wybierz pracownika" v-model="userId"
          option-attribute="name" :items="addEmptyValue('Wszyscy',
            users.map(user => {
              return {
                label: user.name,
                value: user.id
              }
            }))" />
      </UFormField>
      <UCard v-for="timeOff in timeOffs" :key="timeOff.time_off.id">
        <div class="flex justify-between">
          <div>
            <h1 class="text-xl font-bold">{{ timeOff.users?.name }}</h1>
          </div>
          <div class="flex flex-col items-end">
            <p> dodano {{ formatDate(timeOff.time_off.createdTime) }}</p>
            <p>{{ formatDate(timeOff.time_off.startTime) + " - " + formatDate(timeOff.time_off.endTime) }}</p>
          </div>
        </div>
      </UCard>

</template>
<script lang="ts" setup>
import type { TimeOffResponse } from '~~/server/api/types'
import formatDate from "~~/utils/formatDate";


definePageMeta({
  title: 'Urlopy',
  description: 'Lista uropów',
  middleware: 'auth',
})  

const userId = ref(0)

const { data: users } = useFetch('/api/users')

const { data: timeOffs } = useFetch<TimeOffResponse[]>('/api/time-off', {
  query: {
    userId: userId
  },
  watch: [userId]
})

const addEmptyValue = (name: string, list: any[]) => {
  return [{ label: name, value: 0 }, ...list]
}


</script>