import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

// Function to format date to a specific timezone
export const formatDate = (date: Date): string => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; // Get the local timezone
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd HH:mm:ssXXX");  // This is your desired format
};
