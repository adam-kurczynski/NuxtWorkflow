<template>
  <div class="flex flex-col space-y-4">
    <h1 class="text-2xl font-bold w-full text-center p-2">Materiały</h1>
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
    <UButton icon="i-material-symbols-add-2" @click="createMaterial"
      class="fixed bottom-24 right-8 w-12 h-12 flex justify-center shadow-[0px_0px_12px_6px_rgba(34,197,94,1)]" />
    <UModal v-model="isOpen">
      <div class="p-4">
        <h1 class="text-2xl font-bold">{{ `${currentMaterialId ? "Edytuj" : "Dodaj"} materiał` }}</h1>
        <UForm :schema="schema" :state="state" @submit="onSubmit" class="space-y-4">
          <UFormGroup label="Nazwa" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup label="Jednostka" name="unit">
            <UInput v-model="state.unit" />
          </UFormGroup>
          <UButton type="submit" class="w-full flex-row justify-center">
            Dodaj
          </UButton>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import type { Asset } from "~~/server/utils/drizzle";

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