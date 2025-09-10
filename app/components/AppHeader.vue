<template>
  <header
    class="z-10 h-12 p-2 flex justify-center items-center fixed top-0 left-0 w-full mb-2 bg-stone-950 border-b-1"
  >
    <div class="absolute top-2 left-2">
      <UDrawer v-model:open="drawerOpen" direction="left">
        <UButton
          variant="ghost"
          trailing-icon="i-material-symbols-menu"
          @click="drawerOpen = true"
        />
        <template #header>
          <div>
            <h1 class="font-bold">Workflow</h1>
            <UBadge v-if="isAdmin" label="Administrator" />
          </div>
        </template>
        <template #body>
          <div @click="drawerOpen = false">
            <UNavigationMenu
              :items="isAdmin ? AdminItems : UserItems"
              orientation="vertical"
            />
          </div>
        </template>
        <template #footer>
          <div class="flex gap-1 justify-start items-center">
            <UButton
              label="Wyloguj się"
              icon="i-material-symbols-logout-rounded"
              @click="logout"
            />
          </div>
        </template>
      </UDrawer>
    </div>
    <h1 class="text-xl font-bold">Workflow</h1>
  </header>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
const router = useRouter();
const drawerOpen = ref(false);
const { clear: clearUserSession } = useUserSession();
const { user } = useUserSession();
const isAdmin = user.value?.role === "admin";

const AdminItems: NavigationMenuItem[] = [
  {
    label: "Panel główny",
    to: "/",
    icon: "i-material-symbols-house-rounded",
  },
  {
    label: "Zaloguj czas",
    to: "/timesheet",
    icon: "i-material-symbols-calendar-clock-rounded",
  },
  {
    label: "Projekty",
    to: "/projects",
    icon: "i-material-symbols-folder-rounded",
  },
  {
    label: "Klienci",
    to: "/clients",
    icon: "i-material-symbols-person-rounded",
  },
  {
    label: "Użycie materiałów",
    to: "/materials-usage",
    icon: "i-material-symbols-warehouse-rounded",
  },
  {
    label: "Zmień hasło",
    to: "/password-reset",
    icon: "i-material-symbols-vpn-key-rounded",
  },
  {
    label: "Pracownicy",
    to: "/workers",
    icon: "i-material-symbols-manage-accounts",
  },
  {
    label: "Zarządzaj zasobami",
    to: "/materials",
    icon: "i-material-symbols-inventory-rounded",
  },
  {
    label: "Raporty czasu pracy",
    to: "/all-timesheets",
    icon: "i-material-symbols-bar-chart-rounded",
  },
  {
    label: "Urlopy",
    to: "/timeoffs",
    icon: "i-material-symbols-beach-access-rounded",
  },
];

const UserItems: NavigationMenuItem[] = [
  {
    label: "Panel główny",
    to: "/",
    icon: "i-material-symbols-house-rounded",
  },
  {
    label: "Zaloguj czas",
    to: "/timesheet",
    icon: "i-material-symbols-calendar-clock-rounded",
  },
  {
    label: "Projekty",
    to: "/projects",
    icon: "i-material-symbols-folder-rounded",
  },
  {
    label: "Klienci",
    to: "/clients",
    icon: "i-material-symbols-account-circle",
  },
  {
    label: "Użycie materiałów",
    to: "/materials-usage",
    icon: "i-material-symbols-warehouse-rounded",
  },
  {
    label: "Zmień hasło",
    to: "/password-reset",
    icon: "i-material-symbols-vpn-key-rounded",
  },
];

const logout = async () => {
  try {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    await clearUserSession();
    router.push({ name: "login" });
  } catch (error) {
    alert(error.statusMessage || error);
  }
};
</script>
