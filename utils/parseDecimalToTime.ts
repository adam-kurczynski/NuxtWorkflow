export default (hours: number) => {
  const hoursInt = Math.floor(hours);
  const minutes = Math.round((hours - hoursInt) * 60);
  return minutes === 0 ? `${hoursInt}h` : `${hoursInt}h ${minutes}m`;
};
