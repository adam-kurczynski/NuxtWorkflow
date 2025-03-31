<template>
  <div class="flex flex-col h-screen p-2">
    <AppHeader />
    <div class="pt-14 pb-32 flex gap-2 flex-col">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>