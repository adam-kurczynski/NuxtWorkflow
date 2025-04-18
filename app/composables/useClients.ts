import type { FormSubmitEvent } from "@nuxt/ui";
import { string, object, type InferType } from "yup";

export const useClients = (onSuccess: Function) => {
  const search = ref("");
  const toast = useToast();

  const { data, refresh } = useFetch("/api/clients", {
    query: {
      search: search,
    },
  });

  const schema = object({
    name: string().required("Pole wymagane"),
    address: string().required("Pole wymagane"),
    phone: string().required("Pole wymagane"),
  });

  const createClient = async (
    event: FormSubmitEvent<InferType<typeof schema>>
  ) => {
    try {
      await $fetch("/api/clients", {
        method: "POST",
        body: event.data,
      });
      toast.add({
        title: "Dodano klienta",
        color: "success",
      });
      onSuccess();
    } catch (error) {
      toast.add({
        title: "Nie udało się dodać klienta",
        color: "error",
      });
    }
  };
  return {
    search,
    data,
    createClient,
    refresh,
    schema,
  };
};
