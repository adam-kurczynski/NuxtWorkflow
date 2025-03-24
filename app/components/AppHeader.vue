<template>
  <header class="h-12 p-2 flex justify-center items-center fixed top-0 left-0 w-full bg-black text-white mb-2 z-10">
    <h1 class="text-xl font-bold">{{ title }}</h1>
    <UIcon name="i-material-symbols-logout-rounded" class="cursor-pointer w-8 h-8 absolute top-2 right-2"
      @click="logout" />
  </header>
</template>

<script setup>

const router = useRouter();
const route = useRoute();
const title = computed(() => route.meta.title);


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
