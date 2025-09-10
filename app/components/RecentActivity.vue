<template>
  <UCard>
    <h1>
      {{ `${isAdmin ? "Ostatnia aktywność" : "Twoja ostatnia aktywność"}` }}
    </h1>
    <p class="text text-stone-400 text-sm pb-4">
      {{ `${isAdmin ? "Ostatnie wpisy wszystkich pracowników" : ""}` }}
    </p>
    <ul class="flex gap-2 flex-col">
      <li
        v-for="(timesheet, index) in latestTimesheets"
        :key="index"
        class="flex justify-between bg-stone-900 p-2 gap-1 flex-col rounded-md"
      >
        <p>
          {{ timesheet.projects?.name }}
        </p>
        <div class="flex gap-4 items-center justify-between">
          <p class="text-sm">
            {{ formatDate(timesheet.user_timelog.startTime) }}
          </p>
          <p class="text-sm">
            {{ parseDecimalToTime(countLoggedTime(timesheet)) }}
          </p>
        </div>
        <p class="flex justify-end text-stone-400 text-sm">
          {{ formatDate(timesheet.user_timelog.createdAt) }}
        </p>
      </li>
    </ul>
  </UCard>
</template>

<script setup lang="ts">
import type { TimelogResponse } from "~~/server/api/types";
import parseDecimalToTime from "~~/utils/parseDecimalToTime";
import formatDate from "~~/utils/formatDate";
import getFirstAndLastDay from "~~/utils/getFirstAndLastDay";
import countLoggedTime from "~~/utils/countLoggedTime";

const { lastDay } = getFirstAndLastDay(new Date());
const lastDayOfMonth = lastDay.split("T")[0];
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
