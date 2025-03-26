export default eventHandler(async (event) => {
  console.log('event', event)
  await clearUserSession(event)
})