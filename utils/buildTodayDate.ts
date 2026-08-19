export default (time: string) => {
  const hours = time.split(":")[0]
  const minutes = time.split(":")[1]
  const today = new Date()
  today.setHours(Number(hours), Number(minutes), 0, 0)
  
  return today
}

