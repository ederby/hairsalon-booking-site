import { getBookings } from "@/services/apiCalendars";
import { BookingType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useBookings() {
  const { data: bookings, isLoading: isLoadingBookings } = useQuery<
    BookingType[]
  >({
    queryKey: ["bookings"],
    queryFn: getBookings,
  });

  return { bookings, isLoadingBookings };
}
