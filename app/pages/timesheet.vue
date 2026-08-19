<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Left column: Calendar & Actions -->
      <div class="lg:col-span-7 xl:col-span-7 flex flex-col gap-4">
        <client-only>
          <VCalendar
            :is-dark="true"
            locale="pl"
            expanded
            class="w-full"
            :attributes="attrs.concat(timeOffsAttr)"
            @did-move="monthChanged"
            @dayclick="dayChanged"
          />
        </client-only>

        <div class="flex justify-between items-center gap-2">
          <TimeOffForm @submit="refreshTimeOff" />
          <UButton icon="i-material-symbols-add-2" @click="openForm">
            Dodaj godziny
          </UButton>
        </div>

        <BasicInfoCard
          title="Twoje zalogowane godziny w tym miesiącu"
          :bold="parseDecimalToTime(countLoggedTime(monthLogs || 0))"
          description="Suma przepracowanych godzin"
          icon="i-material-symbols-calendar-clock-outline-rounded"
        />
      </div>

      <!-- Right column: Selected Day Details & Logs -->
      <div class="lg:col-span-5 xl:col-span-5 flex flex-col gap-3">
        <div v-if="currDate" class="flex justify-between items-center pb-2 border-b border-zinc-800">
          <h2 class="font-bold text-zinc-100 text-sm">Szczegóły dnia</h2>
          <span class="text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-mono">
            {{ formatDate(currDate) }}
          </span>
        </div>

        <div v-if="currTimeOff.key !== 0" class="relative p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 flex flex-col gap-1">
          <UButton
            class="absolute top-2.5 right-2.5 w-7 h-7 flex justify-center"
            icon="i-material-symbols-delete-rounded"
            color="error"
            variant="ghost"
            size="xs"
            @click="deleteTimeOff(currTimeOff.key)"
          />
          <div class="flex items-center gap-2">
            <UIcon name="i-material-symbols-beach-access-rounded" class="text-amber-400 text-base" />
            <h3 class="text-sm font-bold text-amber-300">Urlop</h3>
          </div>
          <p v-if="currTimeOff.dates" class="text-xs text-zinc-200">
            {{
              formatDate(currTimeOff.dates.start) === formatDate(currTimeOff.dates.end)
                ? formatDate(currTimeOff.dates.start)
                : `${formatDate(currTimeOff.dates.start)} - ${formatDate(currTimeOff.dates.end)}`
            }}
          </p>
        </div>

        <div v-if="dayLogs.length" class="flex flex-col gap-2.5">
          <div
            v-for="log in dayLogs"
            :key="log.user_timelog.id"
            class="flex justify-between items-center p-3.5 rounded-xl border border-zinc-800/80 bg-zinc-900/50 hover:border-zinc-700 transition-colors gap-3"
          >
            <div class="flex flex-col gap-0.5 min-w-0">
              <p class="font-semibold text-sm text-zinc-100 truncate">{{ log.projects?.name || "Brak projektu" }}</p>
              <p class="text-xs text-zinc-400 font-mono">
                {{ formatTime(log.user_timelog.startTime) }} - {{ formatTime(log.user_timelog.endTime) }}
              </p>
            </div>
            <div class="flex items-center gap-2.5 shrink-0">
              <span class="font-bold text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                {{ parseDecimalToTime(countLoggedTime(log)) }}
              </span>
              <UButton
                icon="i-material-symbols-delete-rounded"
                variant="ghost"
                color="error"
                size="xs"
                @click="deleteLog(log.user_timelog.id)"
              />
            </div>
          </div>
        </div>

        <div v-if="dayLogs.length === 0 && currDate" class="p-6 rounded-xl border border-zinc-800/60 bg-zinc-900/30 text-center">
          <p class="text-xs text-zinc-400">Brak zalogowanych godzin w tym dniu</p>
        </div>

        <div v-if="!currDate" class="p-8 rounded-xl border border-dashed border-zinc-800 text-center">
          <UIcon name="i-material-symbols-calendar-month-outline-rounded" class="text-2xl text-zinc-500 mb-1" />
          <p class="text-xs text-zinc-400">Kliknij dzień w kalendarzu, aby wyświetlić szczegóły</p>
        </div>
      </div>
    </div>

    <UModal v-model:open="isOpen" fullscreen title="Dodaj godziny">
      <template #body>
        <div class="p-4">
          <UForm
            :schema="schema"
            :state="state"
            @submit="onSubmit"
            class="space-y-4"
          >
            <UFormField required label="Projekt" name="projectId">
              <USelect
                placeholder="Wybierz projekt"
                v-if="projects"
                class="w-full"
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
  </div>
</template>

<script lang="ts" setup>
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import getFirstAndLastDay from "~~/utils/getFirstAndLastDay";
import type { TimelogResponse, TimeOffResponse } from "~~/server/api/types";
import formatDate from "~~/utils/formatDate";
import buildDateTime from "~~/utils/buildDateTime";
import checkTimes from "~~/utils/checkTimes";
import parseDecimalToTime from "~~/utils/parseDecimalToTime";
import countLoggedTime from "~~/utils/countLoggedTime";
import formatTime from "~~/utils/formatTime";

definePageMeta({
  title: "Twój kalendarz",
  description: "Zarządzaj swoimi godzinami pracy i urlopami",
  middleware: ["auth"],
  colorMode: "dark",
});

interface TimeOffAttr {
  key: number;
  dot: string;
  dates: {
    start: Date;
    end: Date;
  };
  popover: {
    label: string;
    visibility: string;
  };
}

const isOpen = ref(false);
const currMonth = ref(new Date());
const queryStartDate = ref(getFirstAndLastDay(new Date()).firstDay);
const queryEndDate = ref(getFirstAndLastDay(new Date()).lastDay);
const currDate = ref();
const attrs = ref<any[]>([]);
const timeOffsAttr = ref<TimeOffAttr[]>([]);
const currTimeOff = ref<Partial<TimeOffAttr> & { key: number }>({ key: 0 });
const dayLogs = ref([] as TimelogResponse[]);
const toast = useToast();
const { user } = useUserSession();

const { data: monthLogs, refresh: refreshMonth } = await useFetch<
  TimelogResponse[]
>(`/api/timesheet`, {
  query: {
    userId: user.value.id,
    startTime: queryStartDate,
    endTime: queryEndDate,
  },
  onResponse({ response }) {
    attrs.value = response._data.map((item: TimelogResponse) => {
      return {
        key: item.user_timelog.id,
        content: "green",
        dates: [new Date(item.user_timelog.startTime)],
      };
    });
  },
  server: false,
});

const { refresh: refreshTimeOff } = await useFetch<TimeOffResponse[]>(
  `/api/time-off`,
  {
    query: {
      startTime: queryStartDate,
      endTime: queryEndDate,
    },
    server: false,
    onResponse({ response }) {
      timeOffsAttr.value = response._data.map((item: TimeOffResponse) => {
        return {
          key: item.time_off.id,
          dot: user.value.id === item.time_off.userId ? "green" : "yellow",
          dates: {
            start: new Date(item.time_off.startTime),
            end: new Date(item.time_off.endTime),
          },
          popover: {
            label:
              user.value.id === item.time_off.userId
                ? "Twoje dni wolne"
                : "Dni wolne " + item.users?.username,
            visibility: "focus",
          },
        };
      });
    },
  }
);

const { data: projects } = await useFetch("/api/projects");

const state = reactive({
  projectId: undefined,
  startTime: "07:00",
  endTime: "17:00",
});

const schema = object({
  projectId: number().required("Pole wymagane"),
  startTime: string().required("Pole wymagane"),
  endTime: string().required("Pole wymagane"),
});

type Schema = InferType<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  if (!checkTimes(event.data.startTime, event.data.endTime)) {
    toast.add({
      title: "Błąd",
      description:
        "Godzina zakończenia musi być większa od godziny rozpoczęcia",
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
      },
    });
    refreshMonth().then(() => setDayLogs());
    isOpen.value = false;
    toast.add({
      title: "Sukces",
      description: "Godziny zostały dodane",
    });
  } catch (error: any) {
    toast.add({
      title: "Błąd",
      description: error.statusMessage || "Nie udało się dodać godzin",
      color: "error",
    });
  }
};

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
};

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
};

function monthChanged(pages: any) {
  if (!pages || pages.length === 0 || !pages[0]) {
    return;
  }
  currMonth.value = new Date(pages[0].year, pages[0].month - 1, 1);
  queryStartDate.value = getFirstAndLastDay(currMonth.value).firstDay;
  queryEndDate.value = getFirstAndLastDay(currMonth.value).lastDay;
}

function dayChanged(day: any) {
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
  const currTime = new Date(currDate.value).setHours(12, 0, 0, 0);
  const timeOffsTmp = timeOffsAttr.value.filter((item) => {
    const start = new Date(item.dates.start).getTime();
    const end = new Date(item.dates.end).getTime();
    return currTime >= start && currTime <= end && item.dot === "green";
  });
  if (timeOffsTmp.length > 0) {
    currTimeOff.value = timeOffsTmp[0];
  } else {
    currTimeOff.value = { key: 0 };
  }
};

const setDayLogs = () => {
  if (!currDate.value || !monthLogs.value) {
    return;
  }
  const targetYear = currDate.value.getFullYear();
  const targetMonth = currDate.value.getMonth();
  const targetDay = currDate.value.getDate();

  const dayLogsTmp = monthLogs.value.filter((item) => {
    const date = new Date(item.user_timelog.startTime);
    return (
      date.getFullYear() === targetYear &&
      date.getMonth() === targetMonth &&
      date.getDate() === targetDay
    );
  });

  dayLogs.value = dayLogsTmp;
};
</script>
