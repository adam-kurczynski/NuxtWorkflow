import { object, string } from "yup";
import type { FormSubmitEvent } from "#ui/types";
export const useTimeOff = (onSuccessfulSubmit: Function) => {
  const toast = useToast();

  interface TimeOffForm {
    startTime: string;
    endTime: string;
  }

  const { user } = useUserSession();

  const isOpen = ref(false);
  const state = reactive({
    startTime: "",
    endTime: "",
  });

  const schema = object({
    startTime: string().required("Pole wymagane"),
    endTime: string().required("Pole wymagane"),
  });

  const onSubmit = async (event: FormSubmitEvent<TimeOffForm>) => {
    event.preventDefault();
    if (user.value === null) return;
    const { startTime, endTime } = event.data;
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    if (startDate > endDate) {
      toast.add({
        title: "Data zakończenia musi być późniejsza niż data rozpoczęcia",
        color: "error",
      });
      return;
    }
    try {
      await $fetch("/api/time-off", {
        method: "POST",
        body: {
          startTime: startDate,
          endTime: endDate,
          userId: user.value.id,
        },
      });
      toast.add({
        title: "Urlop dodany pomyślnie",
        color: "success",
      });
      isOpen.value = false;
      onSuccessfulSubmit();
    } catch (error) {
      console.error(error);
      toast.add({
        title: error.statusMessage || "Nie udało się dodać urlopu",
        color: "error",
      });
    }
  };

  return {
    isOpen,
    state,
    schema,
    onSubmit,
  };
};
