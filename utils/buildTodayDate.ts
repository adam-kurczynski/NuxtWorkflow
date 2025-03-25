export default (time: string) => {
  const hours = time.split(":")[0]
  const minutes = time.split(":")[1]
  const today = new Date()
  today.setHours(Number(hours))
  today.setMinutes(Number(minutes))
  today.setSeconds(0)
  
  return today
}
