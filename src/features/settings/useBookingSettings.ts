import { getBookingSettings } from "@/services/apiSettings";
import { BookingSettingsType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useBookingSettings() {
  const { data: bookingSettings, isLoading: isLoadingBookingSettings } =
    useQuery<BookingSettingsType>({
      queryKey: ["bookingsettings"],
      queryFn: getBookingSettings,
    });

  return { bookingSettings, isLoadingBookingSettings };
}
