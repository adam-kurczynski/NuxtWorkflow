export default () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().split("T")[0];
};
