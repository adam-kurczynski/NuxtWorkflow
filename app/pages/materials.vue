<template>
  <UInput v-model="searchString" placeholder="Szukaj materiału" />
  <UCard v-if="materials" v-for="material in materials" :key="material.id">
    <div class="flex justify-between flex-direction-row w-full">
      <div class="flex justify-between">
        <div>
          <h1 class="text-xl font-bold">{{ material.name }}</h1>
          <p>{{ material.unit }}</p>
        </div>
      </div>
      <UButton class="w-12 h-12 flex items-center justify-center " icon="i-material-symbols-edit"
        @click="editMaterial(material.id)" />
    </div>
  </UCard>
  <UModal v-model:open="isOpen" fullscreen :title="currentMaterialId ? 'Edytuj materiał' : 'Dodaj materiał'">
    <AddFormButton />
    <template #body>
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Nazwa" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField label="Jednostka" name="unit">
          <UInput v-model="state.unit" class="w-full" />
        </UFormField>
        <UButton type="submit" class="w-full flex-row justify-center">
          {{ currentMaterialId ? 'Edytuj' : 'Dodaj' }}
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { useMaterial } from '~/composables/useMaterial';



definePageMeta({
  title: "Spis materiałów",
  description: "Spis materiałów",
  middleware: ["auth"],
})


const { isOpen, state, schema, onSubmit, materials, searchString, editMaterial, currentMaterialId } = useMaterial();

</script>

<style></style>