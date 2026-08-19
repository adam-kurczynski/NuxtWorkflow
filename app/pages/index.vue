<template>
  <main class="flex flex-col gap-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BasicInfoCard
        title="Wszystkie projekty"
        :bold="projects?.length || 0"
        description="Aktywnych projektów"
        icon="i-material-symbols-folder-outline-rounded"
      />
      <BasicInfoCard
        title="Wszyscy pracownicy"
        :bold="users?.length || 0"
        description="Zarejestrowanych użytkowników"
        icon="i-material-symbols-user-attributes-outline-rounded"
      />
      <BasicInfoCard
        title="Zalogowane godziny w tym miesiącu"
        :bold="parseDecimalToTime(countLoggedTime(timesheets || 0))"
        :description="
          isAdmin
            ? 'Suma przepracowanych godzin wszystkich użytkowników'
            : 'Suma Twoich przepracowanych godzin'
        "
        icon="i-material-symbols-calendar-clock-outline-rounded"
      />
      <BasicInfoCard
        title="Utworzeni klienci"
        :bold="clients?.length || 0"
        description="Wszystkich klientów"
        icon="i-material-symbols-person-4-outline-rounded"
      />
    </div>
    <RecentActivity />
  </main>
</template>

<script setup lang="ts">
import BasicInfoCard from "~/components/BasicInfoCard.vue";
import type { ProjectResponse, TimelogResponse } from "~~/server/api/types";
import parseDecimalToTime from "~~/utils/parseDecimalToTime";
import countLoggedTime from "~~/utils/countLoggedTime";
import getFirstAndLastDay from "~~/utils/getFirstAndLastDay";
import type { Client } from "~~/server/utils/drizzle";

definePageMeta({
  title: "Panel główny",
  description: "Przglądaj statystyki i aktywność",
  middleware: ["auth"],
  colorMode: "dark",
});

const { firstDayFormatted, lastDayFormatted } = getFirstAndLastDay(new Date());
const firstDayOfMonth = firstDayFormatted;
const lastDayOfMonth = lastDayFormatted;
const { user } = useUserSession();
const isAdmin = user.value?.role === "admin";

const { data: projects } = await useFetch<ProjectResponse[]>("/api/projects");
const { data: users } = await useFetch<User[]>("/api/users");
const { data: clients } = await useFetch<Client[]>("/api/clients");

const { data: timesheets } = await useFetch<TimelogResponse[]>(
  "api/timesheet",
  {
    query: {
      startTime: firstDayOfMonth,
      endTime: lastDayOfMonth,
      userId: isAdmin ? 0 : user.value.id,
    },
    server: false,
  }
);
</script>
