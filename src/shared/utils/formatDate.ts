export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
};