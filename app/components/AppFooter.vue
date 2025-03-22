<template>
  <div class="fixed bottom-0 left-0 z-50 w-full p-2 bg-black">
    <UHorizontalNavigation :links="isAdmin ? adminLinks : links" class="main-nav" />
  </div>
</template>

<script setup lang="ts">
const { user } = useUserSession();
const isAdmin = user.value?.role === "admin";
const links = [{
  label: "",
  to: "/",
  icon: "i-material-symbols-house-rounded",
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/timesheet",
  icon: 'i-material-symbols-calendar-clock-rounded',
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/projects",
  icon: 'i-material-symbols-folder-rounded',
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/clients",
  icon: 'i-material-symbols-person-rounded',
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/materials",
  icon: 'i-material-symbols-warehouse-rounded',
  iconClass: "h-8 w-8",
}]

const adminLinks = [{
  label: "",
  to: "/",
  icon: "i-material-symbols-house-rounded",
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/timesheet",
  icon: 'i-material-symbols-calendar-clock-rounded',
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/projects",
  icon: 'i-material-symbols-folder-rounded',
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/clients",
  icon: 'i-material-symbols-person-rounded',
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/materials-usage",
  icon: 'i-material-symbols-warehouse-rounded',
  iconClass: "h-8 w-8",
}, {
  label: "",
  to: "/admin-panel",
  icon: 'i-material-symbols-settings-rounded',
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