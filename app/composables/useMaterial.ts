import { string, object, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
export const useMaterial = () => {
  const isOpen = ref(false);
  const searchString = ref("");
  const currentMaterialId = ref<number | null>(null);
  const state = reactive({
    name: "",
    unit: "",
  });
  const toast = useToast();

  const { data: materials, refresh } = useFetch<Asset[]>("/api/assets", {
    watch: [searchString],
    query: {
      name: searchString,
    },
  });

  const schema = object({
    name: string().required("Pole wymagane"),
    unit: string().required("Pole wymagane"),
  });

  type Schema = InferType<typeof schema>;

  const onSubmit = async (event: FormSubmitEvent<Schema>) => {
    event.preventDefault();
    if (currentMaterialId.value) {
      await updateMaterial();
    } else {
      await addMaterial();
    }
    isOpen.value = false;
    clearForm();
    refresh();
  };

  const addMaterial = async () => {
    await fetch("/api/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(state),
    });
    toast.add({
      title: "Dodano materiał",
      color: "success",
    });
    clearForm();
    refresh();
    isOpen.value = false;
    currentMaterialId.value = null;
  };

  const updateMaterial = async () => {
    await fetch(`/api/assets`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: currentMaterialId.value,
        name: state.name,
        unit: state.unit,
      }),
    });
    toast.add({
      title: "Zaktualizowano materiał",
      color: "success",
    });
    clearForm();
    refresh();
    isOpen.value = false;
    currentMaterialId.value = null;
  };

  const clearForm = () => {
    state.name = "";
    state.unit = "";
  };

  const editMaterial = (id: number) => {
    clearForm();
    currentMaterialId.value = id;
    if (materials) {
      const material = materials.value?.find(
        (material: Asset) => material.id === id
      );
      if (material) {
        state.name = material.name;
        state.unit = material.unit;
        isOpen.value = true;
      }
    }
  };
  return {
    isOpen,
    state,
    schema,
    onSubmit,
    materials,
    searchString,
    editMaterial,
    refresh,
    currentMaterialId,
  };
};
