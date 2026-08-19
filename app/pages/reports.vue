<template>
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <div class="lg:col-span-7">
      <UCard>
        <template #header>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <UIcon
                name="i-material-symbols-table-chart-view-rounded"
                class="text-2xl text-primary"
              />
            </div>
            <div>
              <h1 class="text-lg font-bold text-stone-100">Raporty czasu pracy (Excel)</h1>
              <p class="text-xs text-stone-400">
                Pobierz zestawienie godzin pracy w formacie arkusza kalkulacyjnego .xlsx
              </p>
            </div>
          </div>
        </template>

        <UForm :state="state" @submit="onDownload" class="space-y-4">
          <UFormField label="Miesiąc i rok" name="month" required>
            <UInput v-model="state.month" type="month" class="w-full" />
          </UFormField>

          <UFormField v-if="isAdmin" label="Pracownik" name="userId">
            <USelect
              v-if="users"
              class="w-full"
              placeholder="Wybierz pracownika"
              v-model="state.userId"
              option-attribute="name"
              :items="
                addEmptyValue(
                  'Wszyscy pracownicy (osobne arkusze)',
                  users.map((user) => ({
                    label: user.name,
                    value: user.id,
                  }))
                )
              "
            />
            <template #help>
              <p class="text-xs text-stone-400 mt-1">
                Pozostawienie opcji "Wszyscy pracownicy" wygeneruje plik Excel z osobną zakładką (arkuszem) dla każdego pracownika.
              </p>
            </template>
          </UFormField>

          <UButton
            type="submit"
            :loading="isDownloading"
            icon="i-material-symbols-download-rounded"
            class="w-full flex-row justify-center mt-4"
            size="lg"
          >
            Pobierz raport Excel
          </UButton>
        </UForm>
      </UCard>
    </div>

    <div class="lg:col-span-5">
      <UCard class="bg-stone-900/60 border-stone-800">
        <div class="flex flex-col gap-3 text-sm text-stone-300">
          <div class="flex items-center gap-2 font-semibold text-stone-100">
            <UIcon name="i-material-symbols-info-outline-rounded" class="text-lg text-primary" />
            <span>Informacje o strukturze pliku</span>
          </div>
          <ul class="list-disc list-inside space-y-2 text-xs text-stone-400 pl-1 leading-relaxed">
            <li>
              <strong class="text-stone-300">Kolumny:</strong> Pracownik | Projekt | Dzień miesiąca | Liczba godzin | Godzina startu | Godzina końca
            </li>
            <li>
              <strong class="text-stone-300">Format czasu:</strong> Czas pracy zaokrąglany jest do 15 minut i prezentowany w formacie czytelnym (np. 22h 15m, 8h, 8h 30m).
            </li>
            <li>
              <strong class="text-stone-300">Wyróżnienie weekendów:</strong> Każda sobota i niedziela są automatycznie podświetlone kolorem.
            </li>
            <li>
              <strong class="text-stone-300">Podsumowanie:</strong> Na dole każdego arkusza znajduje się wiersz z łączną sumą godzin (np. 160h 45m).
            </li>
          </ul>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import type { User } from "~~/server/api/types";

definePageMeta({
  title: "Pobierz raporty",
  description: "Pobierz raporty czasu pracy do pliku Excel",
  middleware: "auth",
  colorMode: "dark",
});

const toast = useToast();
const { user } = useUserSession();
const isAdmin = computed(() => user.value?.role === "admin");

const now = new Date();
const currentMonthFormatted = `${now.getFullYear()}-${String(
  now.getMonth() + 1
).padStart(2, "0")}`;

const state = reactive({
  month: currentMonthFormatted,
  userId: 0,
});

const isDownloading = ref(false);

const { data: users } = await useFetch<User[]>("/api/users");

const addEmptyValue = (name: string, list: any[]) => {
  return [{ label: name, value: 0 }, ...list];
};

const onDownload = async () => {
  if (!state.month) {
    toast.add({
      title: "Błąd",
      description: "Wybierz miesiąc i rok do wygenerowania raportu",
      color: "error",
    });
    return;
  }

  isDownloading.value = true;
  try {
    const [year, month] = state.month.split("-");
    const response = await $fetch<Blob>("/api/reports/timesheets", {
      query: {
        year,
        month,
        userId: isAdmin.value ? state.userId : user.value?.id,
      },
      responseType: "blob",
    });

    const blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const selectedUser = users.value?.find((u) => u.id === state.userId);
    const workerSuffix =
      isAdmin.value && state.userId !== 0 && selectedUser
        ? `_${selectedUser.name.replace(/\s+/g, "_")}`
        : isAdmin.value
        ? "_wszyscy_pracownicy"
        : `_${user.value?.name?.replace(/\s+/g, "_") || "moj_raport"}`;

    const filename = `Raport_czasu_pracy_${year}_${month}${workerSuffix}.xlsx`;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast.add({
      title: "Sukces",
      description: `Raport "${filename}" został pomyślnie wygenerowany i pobrany.`,
      color: "success",
    });
  } catch (error: any) {
    console.error(error);
    toast.add({
      title: "Błąd",
      description:
        error?.statusMessage ||
        error?.message ||
        "Nie udało się wygenerować raportu Excel",
      color: "error",
    });
  } finally {
    isDownloading.value = false;
  }
};
</script>

<style scoped></style>
