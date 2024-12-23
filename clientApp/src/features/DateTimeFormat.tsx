import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const formatDate = (date: Date): string => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd HH:mm:ssXXX");  
};

export const formatDateOnly = (date: Date): string => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd");  
};