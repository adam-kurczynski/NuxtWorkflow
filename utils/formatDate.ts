export default (date: string | Date) => {
  if (typeof date === 'string') {
  const stringDate = new Date(date);
  return stringDate.toLocaleDateString('pl', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  }else {
    return date.toLocaleDateString('pl', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}
