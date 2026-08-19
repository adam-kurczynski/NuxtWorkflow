<template>
  <div class="flex flex-col gap-6">
    <UCard>
      <div class="max-w-md">
        <UFormField label="Filtruj według pracownika" name="userId">
          <USelect
            v-if="users"
            class="w-full"
            placeholder="Wybierz pracownika"
            v-model="userId"
            option-attribute="name"
            :items="addEmptyValue('Wszyscy pracownicy',
              users.map(user => ({
                label: user.name,
                value: user.id
              }))
            )"
          />
        </UFormField>
      </div>
    </UCard>

    <div v-if="timeOffs && timeOffs.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="timeOff in timeOffs" :key="timeOff.time_off.id" class="hover:border-stone-700 transition-colors">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols-beach-access-rounded" class="text-amber-400 text-lg shrink-0" />
            <h1 class="font-bold text-base text-stone-100 truncate">{{ timeOff.users?.name }}</h1>
          </div>
          <div class="flex flex-col gap-1 pt-2 border-t border-stone-800 text-xs">
            <span class="font-semibold text-stone-200">
              {{
                formatDate(timeOff.time_off.startTime) === formatDate(timeOff.time_off.endTime)
                  ? formatDate(timeOff.time_off.startTime)
                  : `${formatDate(timeOff.time_off.startTime)} - ${formatDate(timeOff.time_off.endTime)}`
              }}
            </span>
            <span class="text-zinc-400">
              Zgłoszono: {{ formatDate(timeOff.time_off.createdTime) }}
            </span>
          </div>
        </div>
      </UCard>
    </div>

    <UCard v-else class="text-center py-8 border-dashed border-stone-800">
      <p class="text-stone-400 text-sm">Brak zarejestrowanych urlopów dla wybranego filtra</p>
    </UCard>
  </div>
</template>
<script lang="ts" setup>
import type { TimeOffResponse } from '~~/server/api/types'
import formatDate from "~~/utils/formatDate";


definePageMeta({
  title: 'Urlopy',
  description: 'Lista uropów',
  middleware: 'auth',
  colorMode: 'dark'
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