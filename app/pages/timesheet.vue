<template>
  <div class="w-full p-2 flex justify-center flex-col gap-2">
    <client-only>
      <VCalendar locale="pl" @did-move="monthChanged" @dayclick="dayChanged" :attributes="attrs" />
    </client-only>
    <h1 v-if="currDate" class="text-center">{{ formatDate(currDate) }} </h1>
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
    <UButton icon="i-material-symbols-add-2" @click="openForm"
      class="fixed bottom-24 right-8 w-12 h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]" />
    <UModal v-model="isOpen">
      <div class="p-4">
        <h1 class="text-2xl font-bold">Dodaj godziny</h1>
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
          <UFormGroup label="Projekt" name="projectId">
            <USelect v-if="projects" v-model="state.projectId" option-attribute="name" :options="projects.map(project => {
              return {
                name: project.projects.name,
                value: project.projects.id
              }
            })" />
          </UFormGroup>
          <UFormGroup label="Godzina rozpoczęcia" name="startTime">
            <UInput v-model="state.startTime" type="time" />
          </UFormGroup>
          <UFormGroup label="Godzina zakończenia" name="endTime">
            <UInput v-model="state.endTime" type="time" />
          </UFormGroup>
          <UButton type="submit" class="w-full flex-row justify-center">
            Dodaj
          </UButton>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import getFirstAndLastDay from "~~/utils/getFirstAndLastDay";
import { type Page, type CalendarDay } from "v-calendar/dist/types/src/utils/page.js";
import type { AttributeConfig } from "v-calendar/dist/types/src/utils/attribute.js";
import type { TimelogResponse, User } from "~~/server/api/types";
import formatDate from "~~/utils/formatDate";
import formatDateTime from "~~/utils/formatDateTime";
import buildDateTime from "~~/utils/buildDateTime";
import checkTimes from "~~/utils/checkTimes";

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
const attrs = ref([] as AttributeConfig[]);
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
        dot: "success",
        dates: [new Date(item.user_timelog.startTime)],
      }
    })
  },
  server: false
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
    console.log({ error });
    toast.add({
      title: "Błąd",
      description: error.statusMessage || "Nie udało się dodać godzin",
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
    });
  }
}


function monthChanged(pages: Page[]) {
  if (!pages || pages.length === 0 || !pages[0]) {
    return;
  }
  console.log("monthChanged", pages[0]);
  currMonth.value = new Date(pages[0].year, pages[0].month - 1, 1);
  queryStartDate.value = getFirstAndLastDay(currMonth.value).firstDay;
  queryEndDate.value = getFirstAndLastDay(currMonth.value).lastDay;
}

function dayChanged(day: CalendarDay) {
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
});

const setDayLogs = () => {
  if (!currDate.value || !monthLogs.value) {
    console.log("no currDate or monthLogs");
    return;
  }
  const dayLogsTmp = monthLogs.value.filter((item) => {
    const date = new Date(item.user_timelog.startTime);
    return date.getDate() === currDate.value.getDate();
  });

  dayLogs.value = dayLogsTmp
}

</script>

<style>
.vc-container {
  width: 100%;
  ;
}
</style>