const getDateString = (date) => {
  date = date.toString();
  return date.split(' ').splice(0, 4).join(' ');
};

const addDays = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const getDateAfterMonth = (date) => {
  return new Date(date.getTime() + 31 * 1000 * 3600 * 24);
};

export const getUTC00ByDate = (date) => {
  date = new Date(getDateString(date));
  var userTimezoneOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - userTimezoneOffset);
};

const getDaysBetween = (start, end) => {
  start = new Date(getDateString(start));
  end = new Date(getDateString(end));
  const diffInMS = end.getTime() - start.getTime();
  const days = Math.floor(diffInMS / (1000 * 3600 * 24));
  return diffInMS < 0 ? -1 : days;
};

export {getDateString, addDays, getDaysBetween};
