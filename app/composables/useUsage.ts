import getPreviousMonthDate from "~~/utils/getPreviuosMonthDate";
import type { AssetUsageResponse, User } from "~~/server/api/types";
import { number, object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
export const useUsage = (
  onSuccess: Function,
  showProjectDropdown = false,
  projectId = 0
) => {
  const state = reactive({
    projectId: 0,
    assetId: 0,
    startDate: getPreviousMonthDate(),
    endDate: new Date().toISOString().split("T")[0],
  });

  const getURL = computed(
    () =>
      `/api/usage?projectId=${state.projectId}&assetId=${state.assetId}&startDate=${state.startDate}&endDate=${state.endDate}`
  );

  const schema = object({
    projectId: number().required("Pole wymagane"),
    assetId: number().required("Pole wymagane"),
    startDate: string().required("Pole wymagane"),
    endDate: string().required("Pole wymagane"),
  });

  const {
    data: materialsUsage,
    error,
    refresh,
  } = useFetch<AssetUsageResponse[]>(getURL, {
    watch: false,
  });

  const toast = useToast();

  const deleteMaterial = async (id: number) => {
    try {
      await $fetch(`/api/usage?id=${id}`, {
        method: "DELETE",
      });
      toast.add({
        title: "Usunięto",
        description: "Usunięto materiał",
        color: "success",
      });
      refresh();
    } catch (error) {
      toast.add({
        title: "Wystąpił błąd",
        description: "Błąd podczas usuwania materiału",
        color: "error",
      });
    }
  };

  const { user } = useUserSession();

  const formState = reactive({
    projectId: 0,
    assetId: 0,
    quantity: undefined,
  });

  const formSchema = showProjectDropdown
    ? object({
        projectId: number().required("Pole wymagane"),
        assetId: number().required("Pole wymagane"),
        quantity: number().required("Pole wymagane"),
      })
    : object({
        assetId: number().required("Pole wymagane"),
        quantity: number().required("Pole wymagane"),
      });

  const createUsage = async (
    event: FormSubmitEvent<InferType<typeof formSchema>>
  ) => {
    event.preventDefault();
    if (user.value === null) return;
    const body = event.data;
    try {
      await $fetch("/api/usage", {
        method: "POST",
        body: JSON.stringify({
          projectId: showProjectDropdown ? body.projectId : projectId,
          assetId: body.assetId,
          quantity: body.quantity,
          addedBy: user.value.id,
        }),
      });
      toast.add({
        title: "Dodano",
        description: "Dodano materiał",
        color: "success",
      });
      onSuccess();
    } catch (error) {
      toast.add({
        title: "Wystąpił błąd",
        description: "Błąd podczas dodawania materiału",
        color: "error",
      });
    }
  };

  return {
    state,
    materialsUsage,
    schema,
    deleteMaterial,
    refresh,
    createUsage,
    formState,
    formSchema,
  };
};
