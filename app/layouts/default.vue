<template>
  <div class="flex flex-col h-screen p-2">
    <AppHeader />
    <div class="pt-14 pb-14 flex gap-2 flex-col">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>