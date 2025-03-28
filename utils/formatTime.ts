export default (time: Date | string) => {
  if (typeof time === 'string') {
    time = new Date(time)
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }
  const formatter = new Intl.DateTimeFormat('en-US', options)
  const parts = formatter.formatToParts(time)
  const dateParts: Record<string, string> = {}
  for (const part of parts) {
    if (part.type !== 'literal') {
      dateParts[part.type] = part.value
    }
  }
  const formattedDate = `${dateParts.hour}:${dateParts.minute}:${dateParts.second}`
  return formattedDate
}
