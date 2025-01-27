import Spinner from "@/components/layout/Spinner";
import BookingHistoryProvider from "@/context/BookingHistoryContext";
import BookingHistoryDataTable from "./BookingHistoryDataTable";
import { useAllBookings } from "./useAllBookings";

export default function BookingHistory(): JSX.Element {
  const { allBookings, isLoadingAllBookings } = useAllBookings();

  if (isLoadingAllBookings) return <Spinner />;

  return (
    <BookingHistoryProvider>
      <BookingHistoryDataTable allBookings={allBookings ?? []} />
    </BookingHistoryProvider>
  );
}
