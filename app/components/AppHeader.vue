<template>
  <header
    class="z-20 h-14 fixed top-0 left-0 w-full bg-[#09090b]/80 backdrop-blur-xl border-b border-zinc-800/80"
  >
    <div class="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <div class="flex items-center gap-3">
        <UDrawer v-model:open="drawerOpen" direction="left">
          <UButton
            variant="ghost"
            icon="i-material-symbols-menu"
            @click="drawerOpen = true"
            class="text-zinc-300 hover:text-white"
          />
          <template #header>
            <div class="flex items-center justify-between w-full">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <UIcon name="i-material-symbols-grid-view-rounded" class="text-lg" />
                </div>
                <h1 class="font-bold text-base text-zinc-100">Workflow</h1>
                <UBadge v-if="isAdmin" label="Admin" color="primary" variant="subtle" size="xs" />
              </div>
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
            <div class="flex gap-2 justify-between items-center w-full">
              <span class="text-xs text-zinc-400 truncate">{{ user?.name || user?.username }}</span>
              <UButton
                label="Wyloguj się"
                icon="i-material-symbols-logout-rounded"
                variant="ghost"
                color="error"
                @click="logout"
              />
            </div>
          </template>
        </UDrawer>
        <NuxtLink to="/" class="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div class="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950/30">
            <UIcon name="i-material-symbols-grid-view-rounded" class="text-lg" />
          </div>
          <h1 class="text-base font-bold tracking-tight text-zinc-100">Workflow</h1>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2.5">
        <UBadge v-if="isAdmin" label="Admin" color="primary" variant="subtle" size="xs" class="hidden sm:inline-flex font-mono" />
        <div v-if="user" class="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
          <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
            {{ (user.name || user.username || "U").charAt(0).toUpperCase() }}
          </div>
          <span class="text-xs font-medium text-zinc-200">{{ user.name }}</span>
        </div>
        <UButton
          icon="i-material-symbols-logout-rounded"
          variant="ghost"
          color="neutral"
          size="sm"
          class="hidden sm:flex hover:text-red-400 transition-colors"
          @click="logout"
          title="Wyloguj się"
        />
      </div>
    </div>
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
  {
    label: "Pobierz raporty",
    to: "/reports",
    icon: "i-material-symbols-download-for-offline-rounded",
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
