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
    const [sYear, sMonth, sDay] = startTime.split("-").map(Number);
    const [eYear, eMonth, eDay] = endTime.split("-").map(Number);

    const startDate = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0);
    const endDate = new Date(eYear, eMonth - 1, eDay, 23, 59, 59, 999);
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
    } catch (error: any) {
      console.error(error);
      toast.add({
        title: error?.statusMessage || "Nie udało się dodać urlopu",
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
