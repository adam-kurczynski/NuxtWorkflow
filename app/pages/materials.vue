<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
      <UInput v-model="searchString" placeholder="Szukaj materiału..." class="flex-1" icon="i-material-symbols-search" />
      <UButton
        icon="i-material-symbols-add-2"
        class="shrink-0 justify-center"
        @click="isOpen = true"
      >
        Dodaj materiał
      </UButton>
    </div>

    <div v-if="materials && materials.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="material in materials" :key="material.id" class="hover:border-stone-700 transition-colors">
        <div class="flex justify-between items-center gap-2">
          <div class="flex flex-col">
            <h1 class="text-base font-bold text-stone-100">{{ material.name }}</h1>
            <p class="text-xs text-stone-400">Jednostka: <span class="text-stone-300 font-medium">{{ material.unit }}</span></p>
          </div>
          <UButton
            icon="i-material-symbols-edit"
            variant="soft"
            size="sm"
            @click="editMaterial(material.id)"
          />
        </div>
      </UCard>
    </div>

    <UCard v-else class="text-center py-8 border-dashed border-stone-800">
      <p class="text-stone-400 text-sm">Brak materiałów do wyświetlenia</p>
    </UCard>

    <UModal v-model:open="isOpen" fullscreen :title="currentMaterialId ? 'Edytuj materiał' : 'Dodaj materiał'">
      <template #body>
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
          <UFormField label="Nazwa" name="name" required>
            <UInput v-model="state.name" class="w-full" />
          </UFormField>
          <UFormField label="Jednostka" name="unit" required>
            <UInput v-model="state.unit" class="w-full" />
          </UFormField>
          <UButton type="submit" class="w-full flex-row justify-center">
            {{ currentMaterialId ? 'Zapisz zmiany' : 'Dodaj' }}
          </UButton>
        </UForm>
      </template>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { useMaterial } from '~/composables/useMaterial';



definePageMeta({
  title: "Spis materiałów",
  description: "Spis materiałów",
  middleware: ["auth"],
  colorMode: 'dark'
})

const appConfig = useAppConfig()
console.log(appConfig)


const { isOpen, state, schema, onSubmit, materials, searchString, editMaterial, currentMaterialId } = useMaterial();

</script>

<style></style>