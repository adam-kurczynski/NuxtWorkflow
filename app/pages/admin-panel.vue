<template>
  <div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <button
        v-if="isAdmin"
        @click="goToTimesheet"
        class="group text-left p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-emerald-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-emerald-950/20 transition-all duration-200 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          <UIcon name="i-material-symbols-alarm-outline-rounded" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base text-zinc-100 group-hover:text-emerald-300 transition-colors">Czasy pracy</span>
          <span class="text-xs text-zinc-400">Przeglądaj wszystkie godziny pracowników</span>
        </div>
      </button>

      <button
        @click="goToMaterials"
        class="group text-left p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-blue-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-blue-950/20 transition-all duration-200 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          <UIcon name="i-material-symbols-assignment-outline-rounded" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base text-zinc-100 group-hover:text-blue-300 transition-colors">Materiały</span>
          <span class="text-xs text-zinc-400">Katalog i spis materiałów</span>
        </div>
      </button>

      <button
        v-if="isAdmin"
        @click="goToEmployees"
        class="group text-left p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-purple-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-purple-950/20 transition-all duration-200 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          <UIcon name="i-material-symbols-user-attributes-outline-rounded" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base text-zinc-100 group-hover:text-purple-300 transition-colors">Pracownicy</span>
          <span class="text-xs text-zinc-400">Zarządzanie kontami użytkowników</span>
        </div>
      </button>

      <button
        @click="goToTimeoffs"
        class="group text-left p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-amber-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-amber-950/20 transition-all duration-200 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          <UIcon name="i-material-symbols-timer-off-outline-rounded" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base text-zinc-100 group-hover:text-amber-300 transition-colors">Urlopy</span>
          <span class="text-xs text-zinc-400">Rejestr i harmonogram urlopów</span>
        </div>
      </button>

      <button
        @click="goToReports"
        class="group text-left p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-teal-500/30 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-teal-950/20 transition-all duration-200 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          <UIcon name="i-material-symbols-download-for-offline-rounded" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base text-zinc-100 group-hover:text-teal-300 transition-colors">Raporty Excel</span>
          <span class="text-xs text-zinc-400">Eksport zestawień miesięcznych .xlsx</span>
        </div>
      </button>

      <button
        @click="goToPasswordReset"
        class="group text-left p-5 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80 hover:shadow-lg transition-all duration-200 flex items-start gap-4"
      >
        <div class="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
          <UIcon name="i-material-symbols-key-vertical-outline-rounded" />
        </div>
        <div class="flex flex-col">
          <span class="font-bold text-base text-zinc-100 group-hover:text-zinc-300 transition-colors">Zmiana hasła</span>
          <span class="text-xs text-zinc-400">Bezpieczeństwo i dostęp</span>
        </div>
      </button>
    </div>

    <div class="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-5 backdrop-blur">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="font-bold text-zinc-100 text-sm">Ograniczenia logowania godzin</h2>
          <p class="text-xs text-zinc-400">Wyłączenie ograniczeń pozwala na swobodne wprowadzanie czasu pracy</p>
        </div>
        <USwitch
          :loading="isLoading"
          v-on:update:model-value="onSwitchChange"
          size="xl"
          v-model="switchEnabled"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>


definePageMeta({
  title: 'Konfiguracja',
  description: 'Panel administracyjny',
  middleware: 'auth',
  colorMode: 'dark'
})

const { user } = useUserSession();
const toast = useToast()
const isLoading = ref(false)
const isAdmin = user.value?.role === "admin";
const router = useRouter();
const switchEnabled  = ref(false as boolean)
const { data: isLoggingRestrictionDisabled, refresh} = useFetch<Boolean>('/api/config', {
  onResponse({ response }) {
      switchEnabled.value = response._data
      isLoading.value = false
    }
  })

const onSwitchChange = async (value: boolean) => {
  isLoading.value = true
  try {
    await $fetch("/api/config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enable: value
      })
    })
    isLoading.value = false
  } 
  catch (error) {
    refresh()
    toast.add({
      title: "Wystąpił błąd"
    })
  }
}

  

const goToTimesheet = () => {
  router.push({ name: 'all-timesheets' });
}

const goToTimeoffs = () => {
  router.push({name: 'timeoffs'})
}

const goToReports = () => {
  router.push({name: 'reports'})
}

const goToMaterials = () => {
  router.push({ name: 'materials' });
}

const goToEmployees = () => {
  router.push({ name: 'workers' });
}

const goToPasswordReset = () => {
  router.push({ name: 'password-reset' });
}

</script>

<style>
.gallery-item {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;
}
</style>