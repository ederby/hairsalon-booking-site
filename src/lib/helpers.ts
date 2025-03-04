import { supabase } from "@/services/supabase";
import { ExtraservicesType } from "@/services/types";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

export async function uploadImageToBucket(
  image: File | undefined
): Promise<string | undefined> {
  let imagePath: string | undefined;

  if (image) {
    const imageName: string = `${Math.random()}-${image?.name}`.replace(
      /\//g,
      ""
    );
    imagePath = `${
      import.meta.env.VITE_SUPABASE_URL as string
    }/storage/v1/object/public/images/${imageName}`;

    const { error: storageError } = await supabase.storage
      .from("images")
      .upload(imageName, image);

    if (storageError) {
      console.error("File could not be uploaded.");
      throw new Error("File could not be uploaded.");
    }
  }

  return imagePath;
}

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
  const dayOfWeek = capitalizeFirstLetter(format(date, "EEE", { locale: sv }));
  const day = format(date, "d", { locale: sv });
  const month = format(date, "MMMM", { locale: sv });
  const year = format(date, "yyyy", { locale: sv });
  return `${dayOfWeek} ${day} ${month}, ${year}`;
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

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
