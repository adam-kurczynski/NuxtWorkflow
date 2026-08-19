<template>
  <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur">
    <div class="flex items-center justify-between pb-4 border-b border-zinc-800/70 mb-4">
      <div class="flex items-center gap-2.5">
        <div class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
        <div>
          <h2 class="text-base font-bold text-zinc-100">
            {{ isAdmin ? "Ostatnia aktywność" : "Twoja ostatnia aktywność" }}
          </h2>
          <p v-if="isAdmin" class="text-xs text-zinc-400">
            Ostatnie zarejestrowane godziny wszystkich pracowników
          </p>
        </div>
      </div>
      <UIcon name="i-material-symbols-history-rounded" class="text-zinc-400 text-lg" />
    </div>

    <ul v-if="latestTimesheets && latestTimesheets.length" class="flex flex-col gap-2.5">
      <li
        v-for="(timesheet, index) in latestTimesheets"
        :key="index"
        class="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-800/40 transition-all gap-2"
      >
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs shrink-0">
            <UIcon name="i-material-symbols-schedule-rounded" />
          </div>
          <div class="flex flex-col">
            <span class="font-medium text-sm text-zinc-200 group-hover:text-emerald-300 transition-colors">
              {{ timesheet.projects?.name || "Brak projektu" }}
            </span>
            <span v-if="isAdmin && timesheet.users?.name" class="text-xs text-zinc-400">
              {{ timesheet.users.name }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-4 text-xs pl-10 sm:pl-0">
          <span class="text-zinc-400">{{ formatDate(timesheet.user_timelog.startTime) }}</span>
          <span class="font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-xs font-mono">
            {{ parseDecimalToTime(countLoggedTime(timesheet)) }}
          </span>
        </div>
      </li>
    </ul>

    <div v-else class="text-center py-6 text-sm text-zinc-400">
      Brak ostatniej aktywności do wyświetlenia
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TimelogResponse } from "~~/server/api/types";
import parseDecimalToTime from "~~/utils/parseDecimalToTime";
import formatDate from "~~/utils/formatDate";
import getFirstAndLastDay from "~~/utils/getFirstAndLastDay";
import countLoggedTime from "~~/utils/countLoggedTime";

const { lastDayFormatted } = getFirstAndLastDay(new Date());
const lastDayOfMonth = lastDayFormatted;
const { user } = useUserSession();
const isAdmin = user.value?.role === "admin";

const props = defineProps<{
  onlyCurrentUser?: boolean;
}>();

const { data: latestTimesheets } = await useFetch<TimelogResponse[]>(
  "api/timesheet",
  {
    query: {
      startTime: "1900-01-01",
      endTime: lastDayOfMonth,
      userId: isAdmin ? 0 : user.value.id,
      limit: 3,
    },
    server: false,
  }
);
</script>

<style scoped>
.recent-activity {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.recent-activity h2 {
  margin-bottom: 1rem;
}
.recent-activity ul {
  list-style: none;
  padding: 0;
}
.recent-activity li {
  margin-bottom: 1rem;
}
</style>
