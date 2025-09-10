import type { FormSubmitEvent } from "#ui/types";
import type { ProjectResponse } from "~~/server/api/types";
import { object, string, number, type InferType } from "yup";
export const useProjects = (onSuccessfulSubmit: Function) => {
  const search = ref("");
  const currentProjectId = ref<number | null>(null);
  const state = reactive({
    name: "",
    description: "",
    clientId: 0,
    notes: "",
  });

  const isOpen = ref(false);
  const { data: projects, refresh: refreshProjects } = useFetch<
    ProjectResponse[]
  >("/api/projects", {
    query: {
      search: search,
    },
  });

  const toast = useToast();

  const schema = object({
    name: string().required("Pole wymagane"),
    description: string().required("Pole wymagane"),
    clientId: number(),
    notes: string(),
  });

  const createOrUpdateProject = async (
    event: FormSubmitEvent<InferType<typeof schema>>
  ) => {
    if (currentProjectId.value) {
      console.log(event.data);
      try {
        await fetch("/api/projects", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: currentProjectId.value,
            ...event.data,
          }),
        });
        toast.add({
          color: "success",
          title: "Zaktualizowano projekt",
        });
        onSuccessfulSubmit();
      } catch (error) {
        console.log(error);
        toast.add({
          title: "Nie udało się zaktualizować projektu",
          color: "error",
        });
        clearForm();
      }
    } else {
      try {
        await $fetch("/api/projects", {
          method: "POST",
          body: {
            ...event.data,
            status: "nowy",
          },
        });
        toast.add({
          color: "success",
          title: "Dodano projekt",
        });
        onSuccessfulSubmit();
        clearForm();
      } catch (error) {
        clearForm();
        toast.add({
          title: "Nie udało się dodać projektu",
          color: "error",
        });
      }
    }
  };

  const editProject = (id: number) => {
    clearForm();
    currentProjectId.value = id;
    if (projects) {
      const project = projects.value?.find(
        (project: ProjectResponse) => project.projects.id === id
      );
      if (project) {
        state.name = project.projects.name;
        state.description = project.projects.description || "";
        state.clientId = project?.clients?.id || 0;
        isOpen.value = true;
        state.notes = project.projects.notes;
      }
    }
  };

  const clearForm = () => {
    state.name = "";
    state.description = "";
    state.clientId = 0;
    currentProjectId.value = 0;
    state.notes = "";
  };

  return {
    search,
    projects,
    createOrUpdateProject,
    refreshProjects,
    schema,
    state,
    editProject,
    isOpen,
    currentProjectId,
    clearForm,
  };
};
