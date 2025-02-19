export default (dateTime: string | Date) => {
  if (typeof dateTime === 'string') {
    const stringDateTime = new Date(dateTime);
    return stringDateTime.toLocaleDateString('pl', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  } else {
    return dateTime.toLocaleDateString('pl', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }
}
