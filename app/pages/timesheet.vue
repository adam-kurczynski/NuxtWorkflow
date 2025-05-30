<template>
  <client-only>
    <VCalendar locale="pl" @did-move="monthChanged" @dayclick="dayChanged" :attributes="attrs.concat(timeOffsAttr)" />
  </client-only>
  <h1 v-if="monthLogs?.length" class="text-center">{{ parseDecimalToTime(countLoggedTime(monthLogs)) + ` zalogowanych
    w tym miesiącu`}} </h1>
  <h1 v-if="currDate" class="text-center">{{ formatDate(currDate) }} </h1>
  <UCard v-if="currTimeOff.key !== 0" class="mb-2 relative">
    <UButton class="absolute top-2 right-2 w-8 h-8 flex justify-center" icon="i-material-symbols-delete-rounded"
      @click="deleteTimeOff(currTimeOff.key)" />
    <h1 class="text-xl font-bold">Urlop</h1>
    <p>{{ formatDate(currTimeOff.dates.start) }} - {{ formatDate(currTimeOff.dates.end) }}</p>
  </UCard>
  <UCard v-if="dayLogs.length" v-for="log in dayLogs" :key="log.user_timelog.id" class="mb-2 relative">
    <UButton icon="i-material-symbols-delete-rounded" @click="deleteLog(log.user_timelog.id)"
      class="absolute top-2 right-2 w-8 h-8 flex justify-center" />
    <div class="flex justify-between">
      <h1 class="text-xl font-bold">{{ log.projects?.name }}</h1>
    </div>
    <p>{{ formatDateTime(log.user_timelog.startTime) }} - {{ formatDateTime(log.user_timelog.endTime) }}</p>
  </UCard>
  <UCard v-if="dayLogs.length === 0 && currDate">
    <p>Brak zalogowanych godzin w tym dniu</p>
  </UCard>
  <UButton icon="i-material-symbols-add-2"
    class="bottom-18 fixed z-50 right-4 w-36 h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]"
    @click="openForm">
    Dodaj godziny</UButton>

  <UModal v-model:open="isOpen" fullscreen title="Dodaj godziny">

    <template #body>
      <div class="p-4">
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
          <UFormField required label="Projekt" name="projectId">
            <USelect placeholder="Wybierz projekt" v-if="projects" class="w-full" v-model="state.projectId"
              option-attribute="name" :items="projects.map(project => {
                return {
                  label: project.projects.name,
                  value: project.projects.id
                }
              })" />
          </UFormField>
          <UFormField required label="Godzina rozpoczęcia" name="startTime">
            <UInput v-model="state.startTime" type="time" class="w-full" />
          </UFormField>
          <UFormField required label="Godzina zakończenia" name="endTime">
            <UInput v-model="state.endTime" type="time" class="w-full" />
          </UFormField>
          <UButton type="submit" class="w-full flex-row justify-center">
            Dodaj
          </UButton>
        </UForm>
      </div>
    </template>
  </UModal>
  <TimeOffForm @submit="refreshTimeOff" />
</template>

<script lang="ts" setup>
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import getFirstAndLastDay from "~~/utils/getFirstAndLastDay";
import type { TimelogResponse, TimeOffResponse } from "~~/server/api/types";
import formatDate from "~~/utils/formatDate";
import formatDateTime from "~~/utils/formatDateTime";
import buildDateTime from "~~/utils/buildDateTime";
import checkTimes from "~~/utils/checkTimes";
import parseDecimalToTime from "~~/utils/parseDecimalToTime";
import countLoggedTime from "~~/utils/countLoggedTime";

definePageMeta({
  title: "Twój kalendarz",
  description: "Timesheet",
  middleware: ["auth"],
})

const isOpen = ref(false);
const currMonth = ref(new Date());
const queryStartDate = ref(getFirstAndLastDay(new Date()).firstDay)
const queryEndDate = ref(getFirstAndLastDay(new Date()).lastDay)
const currDate = ref();
const attrs = ref([]);
const timeOffsAttr = ref([]);
const currTimeOff = ref({ key: 0 });
const dayLogs = ref([] as TimelogResponse[]);
const toast = useToast();
const { user } = useUserSession()

const { data: monthLogs, refresh: refreshMonth } = await useFetch<TimelogResponse[]>(`/api/timesheet`, {
  query: {
    userId: user.value.id,
    startTime: queryStartDate,
    endTime: queryEndDate
  },
  onResponse({ response }) {
    attrs.value = response._data.map((item: TimelogResponse) => {
      return {
        key: item.user_timelog.id,
        content: "green",
        dates: [new Date(item.user_timelog.startTime)],
      }
    })
  },
  server: false
});

const { refresh: refreshTimeOff } = await useFetch<TimeOffResponse[]>(`/api/time-off`, {
  query: {
    startTime: queryStartDate,
    endTime: queryEndDate
  },
  server: false,
  onResponse({ response }) {
    timeOffsAttr.value = response._data.map((item: TimeOffResponse) => {
      return {
        key: item.time_off.id,
        dot: user.value.id === item.time_off.userId ? 'green' : 'yellow',
        dates: { start: new Date(item.time_off.startTime), end: new Date(item.time_off.endTime) },
        popover: {
          label: user.value.id === item.time_off.userId ? "Twoje dni wolne" : "Dni wolne " + item.users?.username,
          visibility: 'focus'
        }
      }
    })
  }
});

const { data: projects } = await useFetch("/api/projects");

const state = reactive({
  projectId: undefined,
  startTime: '07:00',
  endTime: '17:00',
});

const schema = object({
  projectId: number().required("Pole wymagane"),
  startTime: string().required("Pole wymagane"),
  endTime: string().required("Pole wymagane"),
})

type Schema = InferType<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!checkTimes(event.data.startTime, event.data.endTime)) {
    toast.add({
      title: "Błąd",
      description: "Godzina zakończenia musi być większa od godziny rozpoczęcia",
    });
    return;
  }
  try {
    await $fetch("/api/timesheet", {
      method: "POST",
      body: {
        ...event.data,
        userId: user.value.id,
        startTime: buildDateTime(currDate.value, event.data.startTime),
        endTime: buildDateTime(currDate.value, event.data.endTime),
      }
    })
    refreshMonth().then(() => setDayLogs())
    isOpen.value = false;
    toast.add({
      title: "Sukces",
      description: "Godziny zostały dodane",
    });
  } catch (error) {

    toast.add({
      title: "Błąd",
      description: error.statusMessage || "Nie udało się dodać godzin",
      color: "error",
    });
  }
}

const deleteLog = async (id: number) => {
  try {
    await $fetch(`/api/timesheet?id=${id}`, {
      method: "DELETE",
    });
    refreshMonth().then(() => setDayLogs());
    toast.add({
      title: "Sukces",
      description: "Godziny zostały usunięte",
    });
  } catch (error) {
    toast.add({
      title: "Błąd",
      description: "Nie udało się usunąć godzin",
      color: "error",
    });
  }
}

const deleteTimeOff = async (id: number) => {
  try {
    await $fetch(`/api/time-off?id=${id}`, {
      method: "DELETE",
    });
    refreshTimeOff();
    currTimeOff.value = { key: 0 };
    toast.add({
      title: "Sukces",
      description: "Urlop został usunięty",
    });
  } catch (error) {
    toast.add({
      title: "Błąd",
      description: "Nie udało się usunąć urlopu",
      color: "error",
    });
  }
}


function monthChanged(pages) {
  if (!pages || pages.length === 0 || !pages[0]) {
    return;
  }
  currMonth.value = new Date(pages[0].year, pages[0].month - 1, 1);
  queryStartDate.value = getFirstAndLastDay(currMonth.value).firstDay;
  queryEndDate.value = getFirstAndLastDay(currMonth.value).lastDay;
}

function dayChanged(day) {
  if (!day) {
    return;
  }
  currDate.value = new Date(day.date);
}

function openForm() {
  if (!currDate.value) {
    toast.add({
      title: "Błąd",
      description: "Wybierz dzień",
    });
    return;
  }
  isOpen.value = true;
}

watch(currDate, () => {
  if (!monthLogs.value) {
    return;
  }
  setDayLogs();
  setTimeoff();
});

const setTimeoff = () => {
  if (!currDate.value || !timeOffsAttr.value) {
    return;
  }
  const timeOffsTmp = timeOffsAttr.value.filter((item) => {
    const start = new Date(item.dates.start);
    const end = new Date(item.dates.end);
    const curr = new Date(currDate.value);
    return curr >= start && curr <= end && item.dot === 'green';
  });
  if (timeOffsTmp.length > 0) {
    currTimeOff.value = timeOffsTmp[0];
  } else {
    currTimeOff.value = { key: 0 };
  }
}

const setDayLogs = () => {
  if (!currDate.value || !monthLogs.value) {
    return;
  }
  const dayLogsTmp = monthLogs.value.filter((item) => {
    const date = new Date(item.user_timelog.startTime);
    return date.getDate() === currDate.value.getDate();
  });

  dayLogs.value = dayLogsTmp
}

</script>
