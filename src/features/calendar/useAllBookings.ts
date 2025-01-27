import { getAllBookings } from "@/services/apiCalendars";
import { BookingType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useAllBookings() {
  const { data: allBookings, isLoading: isLoadingAllBookings } = useQuery<
    BookingType[]
  >({
    queryKey: ["allbookings"],
    queryFn: getAllBookings,
  });

  return { allBookings, isLoadingAllBookings };
}
