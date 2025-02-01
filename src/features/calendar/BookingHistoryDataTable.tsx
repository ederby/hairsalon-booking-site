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
import CalendarEditForm from "./CalendarEditForm";
import { useAllBookings } from "./useAllBookings";
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "canceled" | "expired" | "booked" | ""
  >("");

  const { fetchingStaff } = useStaff();
  const { onDeleteBooking } = useDeleteBooking();
  const { openDialog, setOpenDialog, openAlertDialog, setOpenAlertDialog } =
    useCalendar();
  const {
    currentBookingID,
    setCurrentBookingID,
    currentSorted,
    setCurrentSorted,
    bookAgain,
  } = useBookingHistory();
  const { currentBookingInfo } = useCalendar();
  const { allBookings, isLoadingAllBookings } = useAllBookings();

  const transformedBookings: TransformedBookingType[] = useMemo(
    () =>
      allBookings
        ?.filter((booking) => !booking.break)
        .map((booking) => ({
          date: booking.selectedDate,
          service: booking.service?.title,
          status: booking.canceled
            ? "Avbokad"
            : booking.selectedDate < format(new Date(), "yyyy-MM-dd") ||
              booking.selectedDate !== format(new Date(), "yyyy-MM-dd")
            ? "Utgången"
            : "Bokad",
          customerName: booking.guestInfo.name,
          id: booking.id,
        })) ?? [],
    [allBookings]
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

  const currentBooking = allBookings?.find(
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

  if (fetchingStaff || isLoadingAllBookings) return <Spinner />;

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

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-end space-x-2 py-4">
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

      <Dialog open={openAlertDialog} onOpenChange={setOpenAlertDialog}>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle className="hidden"></DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          {bookAgain ? (
            <CalendarEditForm bookAgain={true} />
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
