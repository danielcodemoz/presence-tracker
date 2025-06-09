export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getDayOfWeek = (day: number, month: number, year: number): number => {
  return new Date(year, month, day).getDay();
};

export const formatDate = (day: number, month: number, year: number): string => {
  return new Date(year, month, day).toLocaleDateString();
};