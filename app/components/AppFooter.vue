<template>
  <div class="fixed bottom-0 left-0 z-50 w-full p-2 bg-black">
    <UHorizontalNavigation :links="links" class="main-nav" />
  </div>
</template>

<script setup>
const links = [{
  to: "/",
  icon: "i-material-symbols-house-rounded",
  iconClass: "h-8 w-8",
}, {
  to: "/timesheet",
  icon: 'i-material-symbols-calendar-clock-rounded',
  iconClass: "h-8 w-8",
}, {
  to: "/projects",
  icon: 'i-material-symbols-folder-rounded',
  iconClass: "h-8 w-8",
}, {
  to: "/clients",
  icon: 'i-material-symbols-person-rounded',
  iconClass: "h-8 w-8",
}, {
  to: "/materials",
  icon: 'i-material-symbols-warehouse-rounded',
  iconClass: "h-8 w-8",
}

]
</script>

<style>
.main-nav ul {
  justify-content: space-between;
  width: 100%;
}
</style>