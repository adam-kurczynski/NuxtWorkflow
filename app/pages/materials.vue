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
  <AddFormButton />
  <UModal v-model:open="isOpen" fullscreen :title="currentMaterialId ? 'Edytuj materiał' : 'Dodaj materiał'">
    <template #body>
      <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
        <UFormField label="Nazwa" name="name">
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField label="Jednostka" name="unit">
          <UInput v-model="state.unit" class="w-full" />
        </UFormField>
        <UButton type="submit" class="w-full flex-row justify-center">
          Dodaj
        </UButton>
      </UForm>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import type { Asset } from "~~/server/utils/drizzle";


definePageMeta({
  title: "Spis materiałów",
  description: "Spis materiałów",
  middleware: ["auth"],
})

const isOpen = ref(false);
const searchString = ref("");
const currentMaterialId = ref<number | null>(null);
const state = reactive({
  name: '',
  unit: ''
});

const schema = object({
  name: string().required("Pole wymagane"),
  unit: string().required("Pole wymagane")
});

type Schema = InferType<typeof schema>;

const onSubmit = async (event: FormSubmitEvent<Schema>) => {
  event.preventDefault();
  if (currentMaterialId.value) {
    await updateMaterial();
  } else {
    await addMaterial();
  }
  refresh();
  isOpen.value = false;
  clearForm();
}

const addMaterial = async () => {
  await fetch("/api/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(state)
  });
}

const updateMaterial = async () => {
  await fetch(`/api/assets`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: currentMaterialId.value,
      name: state.name,
      unit: state.unit
    })
  });
}

const editMaterial = (id: number) => {
  clearForm();
  currentMaterialId.value = id;
  if (materials) {
    const material = materials.value?.find((material: Asset) => material.id === id);
    if (material) {
      state.name = material.name;
      state.unit = material.unit;
      isOpen.value = true;
    }
  }

}

const createMaterial = () => {
  clearForm();
  currentMaterialId.value = null;
  isOpen.value = true;
}

const clearForm = () => {
  state.name = '';
  state.unit = '';
}


const { data: materials, refresh } = await useFetch<Asset[]>("/api/assets", {
  watch: [searchString],
  query: {
    name: searchString
  }
});



</script>

<style></style>