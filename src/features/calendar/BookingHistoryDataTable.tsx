import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBookingHistory } from "@/context/BookingHistoryContext";
import { useCalendar } from "@/context/CalendarContext";
import { useStaff } from "@/hooks/useStaff";
import { incrementTime, reduceExtraServicesDuration } from "@/lib/helpers";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { bookingHistoryColumns } from "./BookingHistoryColumns";
import BookingInfo from "./BookingInfo";
import AddBookingForm from "./AddBookingForm";
import { useBookings } from "./useBookings";
import { useDeleteBooking } from "./useDeleteBooking";

interface TransformedBookingType {
  date: string;
  service: string | undefined;
  status: "Avbokad" | "Utgången" | "Bokad";
  customerName: string;
  id: number;
}

export default function BookingHistoryDataTable(): JSX.Element {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "canceled" | "expired" | "booked" | ""
  >("");

  const { isLoadingStaff } = useStaff();
  const { onDeleteBooking } = useDeleteBooking();
  const {
    currentBookingID,
    setCurrentBookingID,
    currentSorted,
    setCurrentSorted,
    bookAgain,
  } = useBookingHistory();
  const { currentBookingInfo } = useCalendar();
  const { bookings, isLoadingBookings } = useBookings();

  const transformedBookings: TransformedBookingType[] = useMemo(
    () =>
      bookings
        ?.filter((booking) => !booking.break)
        .map((booking) => ({
          date: booking.selectedDate,
          service: booking.service?.title,
          status: booking.canceled
            ? "Avbokad"
            : booking.selectedDate < format(new Date(), "yyyy-MM-dd")
            ? "Utgången"
            : "Bokad",
          customerName: booking.guestInfo.name,
          id: booking.id,
        })) ?? [],
    [bookings]
  );

  const filteredBookingsByStatus = useMemo(
    () =>
      transformedBookings.filter((booking) => {
        if (statusFilter === "all" || statusFilter === "") return true;
        if (statusFilter === "canceled") return booking.status === "Avbokad";
        if (statusFilter === "expired") return booking.status === "Utgången";
        if (statusFilter === "booked") return booking.status === "Bokad";
        return false;
      }),
    [transformedBookings, statusFilter]
  );

  const memoizedColumns = useMemo(
    () =>
      bookingHistoryColumns(
        setCurrentBookingID,
        setOpenAlertDialog,
        currentSorted,
        setCurrentSorted,
        setOpenDialog
      ),
    [
      setOpenDialog,
      setCurrentBookingID,
      currentSorted,
      setCurrentSorted,
      setOpenAlertDialog,
    ]
  );

  const currentBooking = bookings?.find(
    (booking) => booking.id === currentBookingID
  );

  currentBookingInfo.current = {
    resourceID: currentBooking?.staff_id ?? 0,
    subject: currentBooking?.service?.title ?? "",
    guestInfo: {
      email: currentBooking?.guestInfo.email ?? "",
      name: currentBooking?.guestInfo.name ?? "",
      observations: currentBooking?.guestInfo.observations ?? "",
      phone: currentBooking?.guestInfo.phone ?? "",
    },
    startTime: format(new Date(), "HH:mm"),
    endTime: incrementTime(
      format(new Date(), "HH:mm"),
      currentBooking?.duration ||
        0 + reduceExtraServicesDuration(currentBooking?.extraServices)
    ),
    extraServices: currentBooking?.extraServices ?? [],
    id: 0,
    serviceID: currentBooking?.service?.id ?? 0,
    date: new Date(),
    isBreak: false,
  };

  const table = useReactTable({
    data: filteredBookingsByStatus,
    columns: memoizedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  const { rowsById } = table.getRowModel();
  const totalResults = Object.keys(rowsById).length;

  if (isLoadingStaff || isLoadingBookings) return <Spinner />;

  return (
    <>
      <div className="flex items-center pb-4 justify-between">
        <Input
          placeholder="Filtrera kundnamn..."
          value={
            (table.getColumn("customerName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("customerName")?.setFilterValue(event.target.value)
          }
          className="max-w-xs"
        />

        <div className="min-w-40">
          <Select
            value={statusFilter}
            onValueChange={(e: "all" | "canceled" | "expired" | "booked") => {
              setStatusFilter(e);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrera status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <span>Alla</span>
              </SelectItem>
              <SelectItem value="booked">
                <span>Bokade</span>
              </SelectItem>
              <SelectItem value="expired">
                <span>Utgångna</span>
              </SelectItem>
              <SelectItem value="canceled">
                <span>Avbokade</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border border-1 border-zinc-200">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="odd:bg-zinc-50"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={bookingHistoryColumns.length}
                  className="h-24 text-center"
                >
                  Inga resultat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center py-4">
        {totalResults > 0 && (
          <span className="text-sm">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            -
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              totalResults
            )}{" "}
            av {totalResults}
          </span>
        )}
        {table.getPageCount() > 1 && (
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft strokeWidth={1.5} />
            </Button>
            <span className="text-sm">
              Sida {table.getState().pagination.pageIndex + 1} av{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight strokeWidth={1.5} />
            </Button>
          </div>
        )}
      </div>

      <Dialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle className="hidden"></DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          {bookAgain ? (
            <AddBookingForm bookAgain={true} />
          ) : (
            <BookingInfo booking={currentBooking} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialogCustom
        title="Är du helt säker?"
        description="Du håller på att radera denna bokning. Du kan inte ångra detta när den har raderats."
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={() => onDeleteBooking(currentBooking?.id ?? -1)}
        actionText="Radera"
      />
    </>
  );
}
