export default (startTime: string, endTime: string) => {
  const [startHours, startMinutes] = startTime.split(':')
  const [endHours, endMinutes] = endTime.split(':')
  if (Number(startHours) > Number(endHours)) {
    return false
  }
  if (Number(startHours) === Number(endHours) && Number(startMinutes) >= Number(endMinutes)) {
    return false
  }
  return true
}
