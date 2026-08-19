export default function (date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDate = new Date(year, month, 1, 0, 0, 0, 0);
  const lastDate = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return {
    firstDay: firstDate.toISOString(),
    lastDay: lastDate.toISOString(),
    firstDayFormatted: `${year}-${String(month + 1).padStart(2, "0")}-01`,
    lastDayFormatted: `${year}-${String(month + 1).padStart(2, "0")}-${String(
      new Date(year, month + 1, 0).getDate()
    ).padStart(2, "0")}`,
  };
}