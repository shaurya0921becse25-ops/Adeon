export const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch (err) {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return "";
  try {
    const d = new Date(timeString);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (err) {
    return timeString;
  }
};

export const getAvailableDates = (count = 14) => {
  const dates = [];
  const today = new Date();
  for (let i = 1; i <= count; i++) {
    const nextDate = new Date();
    nextDate.setDate(today.getDate() + i);
    dates.push(nextDate.toISOString().split("T")[0]);
  }
  return dates;
};
