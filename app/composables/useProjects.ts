import type { FormSubmitEvent } from "#ui/types";
import type { ProjectResponse } from "~~/server/api/types";
import { object, string, number, type InferType } from "yup";
export const useProjects = (onSuccessfulSubmit: Function) => {
  const search = ref("");
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
  });

  const createProject = async (
    event: FormSubmitEvent<InferType<typeof schema>>
  ) => {
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
    } catch (error) {
      toast.add({
        title: "Nie udało się dodać projektu",
        color: "error",
      });
    }
  };

  return {
    search,
    projects,
    createProject,
    refreshProjects,
    schema,
  };
};
