import BookingHistoryProvider from "@/context/BookingHistoryContext";
import BookingHistoryDataTable from "./BookingHistoryDataTable";

export default function BookingHistory(): JSX.Element {
  return (
    <BookingHistoryProvider>
      <BookingHistoryDataTable />
    </BookingHistoryProvider>
  );
}
