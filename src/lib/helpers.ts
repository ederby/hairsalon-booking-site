import { ExtraservicesType } from "@/services/types";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export function reduceExtraServicesDuration(
  extraServices: ExtraservicesType[] | undefined
): number {
  const totalDuration =
    extraServices?.reduce(
      (acc, extraService) => acc + extraService.duration,
      0
    ) || 0;

  return totalDuration;
}

export function incrementTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(mins + minutes);
  return format(date, "HH:mm");
}

export const formatCustomDate = (date: Date) => {
  if (!date || isNaN(date.getTime())) {
    return "Invalid date";
  }
  const day = format(date, "d", { locale: sv });
  const month = format(date, "MMMM", { locale: sv });
  const year = format(date, "yyyy", { locale: sv });
  return `${day} ${month}, ${year}`;
};

export function isBeforeTime(time: string, compareTime: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const [compareHours, compareMinutes] = compareTime.split(":").map(Number);
  if (hours < compareHours) {
    return true;
  } else if (hours === compareHours && minutes < compareMinutes) {
    return true;
  } else {
    return false;
  }
}

export function isAfterTime(time: string, compareTime: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const [compareHours, compareMinutes] = compareTime.split(":").map(Number);
  if (hours > compareHours) {
    return true;
  } else if (hours === compareHours && minutes > compareMinutes) {
    return true;
  } else {
    return false;
  }
}
