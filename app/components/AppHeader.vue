<template>
  <header class="h-12 p-2 flex justify-center items-center fixed top-0 left-0 w-full bg-black text-white mb-2 z-10">
    <h1 class="text-xl font-bold">Workflow</h1>
    <UIcon name="i-material-symbols-settings" class="cursor-pointer w-8 h-8 absolute top-2 right-2"
      @click="isOpen = true" />
    <USlideover v-model="isOpen" class="w-64 right-0 top-0 h-full left-auto">
      <div class="p-2 flex flex-col justify-between h-full">
        <UVerticalNavigation :links="links" @click="isOpen = false" />
        <div class="flex justify-end">
          <UButton @click="logout" class="w-24">Logout
            <UIcon name="i-material-symbols-exit-to-app" />
          </UButton>
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup>

import { ref } from "vue";

const isOpen = ref(false);

const router = useRouter();

const links = [{
  label: "Słowniki",
  to: "/dictionaries",
  icon: "i-material-symbols-dictionary-rounded"
}]

const logout = async () => {
  try {
    await $fetch("/api/auth/logout", {
      method: "POST",
    });
    router.push({ name: 'login' })
  } catch (error) {
    console.log({ error });
    alert(error.statusMessage || error);
  }
};

</script>
