export default defineNuxtRouteMiddleware(() => {
  const { loggedIn, user } = useUserSession()

    if(!loggedIn.value) {
      return navigateTo('/login')
    }
    if(!user.value || user.value.role !== 'admin') {
      return navigateTo('/unauthorized')
    }
})
