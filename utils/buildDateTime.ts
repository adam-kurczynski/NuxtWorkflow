export default (date: Date, time: string) => {
  const [hours, minutes] = time.split(':')
  const newDate = new Date(date)
  newDate.setHours(Number(hours), Number(minutes), 0, 0)
  return newDate
}

