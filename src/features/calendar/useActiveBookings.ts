import { getActiveBookings } from "@/services/apiCalendars";
import { BookingType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useActiveBookings() {
  const { data: activeBookings, isLoading: isLoadingactiveBookings } = useQuery<
    BookingType[]
  >({
    queryKey: ["activebookings"],
    queryFn: getActiveBookings,
  });

  return { activeBookings, isLoadingactiveBookings };
}
