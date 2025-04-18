<template>
  <UModal v-model:open="isOpen" fullscreen title="Dodaj materiał">
    <AddFormButton @click="openForm" :text="buttonText" />
    <template #body>
      <UForm :schema="formSchema" :state="formState" @submit="createUsage" class="space-y-4">
        <UFormField label="Materiał" name="assetId">
          <USelect v-if="assets" class="w-full" v-model="formState.assetId" option-attribute="name" :items="assets.map(asset => {
            return {
              label: asset.name,
              value: asset.id
            }
          })" />
        </UFormField>
        <UFormField label="Projekt" name="projectId" v-if="props.showProjectsDropdown">
          <USelect v-if="projects" class="w-full" v-model="formState.projectId" option-attribute="name" :items="projects.map(project => {
            return {
              label: project.projects.name,
              value: project.projects.id
            }
          })" />
        </UFormField>
        <UFormField label="Ilość" name="quantity">
          <div class="flex justify-between items-center">
            <UInput v-model="formState.quantity" class="w-full" />
            <p class="pl-2">{{ currUnit }}</p>
          </div>
        </UFormField>
        <UButton type="submit" class="w-full flex-row justify-center">
          Dodaj
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { object, string, number, type InferType } from 'yup'
import type { ProjectResponse, Asset } from '~~/server/api/types'

const props = defineProps({
  showProjectsDropdown: Boolean,
  projectId: Number,
  buttonText: String
})

const emit = defineEmits(['submit'])

const { data: projects } = await useFetch<ProjectResponse[]>('/api/projects')
const { data: assets } = await useFetch<Asset[]>('/api/assets')

const isOpen = ref(false)
const currUnit = ref('')

const onCreateSuccess = () => {
  isOpen.value = false
  emit('submit')
}

const { formState, formSchema, createUsage } = useUsage(onCreateSuccess, props.showProjectsDropdown, props.projectId)
const openForm = () => {
  isOpen.value = true

}

watch(formState, () => {
  currUnit.value = getUnit() || ''
})

const getUnit = () => {
  if (assets.value) {
    return assets.value.find(asset => asset.id == formState.assetId)?.unit
  }
}






</script>

<style></style>