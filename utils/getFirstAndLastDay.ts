export default function (date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString()
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59).toISOString()
  return { firstDay, lastDay }
}