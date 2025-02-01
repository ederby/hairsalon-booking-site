import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  BadgeMinus,
  BadgeX,
  CalendarPlus,
  CircleX,
  Info,
} from "lucide-react";

export type FormattedBookingType = {
  date: string;
  service: string | undefined;
  status: "Avbokad" | "Utgången" | "Bokad";
  customerName: string;
  id: number;
};

export function bookingHistoryColumns(
  setCurrentBookingID: (id: number, bookAgain: boolean) => void,
  setOpenDialog: (open: boolean) => void,
  currentSorted: string | null,
  setCurrentSorted: (
    sorted: "date" | "service" | "status" | "customerName"
  ) => void,
  setOpenAlertDialog: (open: boolean) => void
): ColumnDef<FormattedBookingType>[] {
  return [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`px-0 gap-0 hover:bg-transparent hover:text-teal-600 ${
              currentSorted === "date" ? "text-teal-600" : ""
            }`}
            onClick={() => {
              setCurrentSorted("date");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Datum
            {!column.getIsSorted() ? (
              ""
            ) : column.getIsSorted() === "asc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "service",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className={`px-0 gap-0 hover:bg-transparent hover:text-teal-600 ${
              currentSorted === "service" ? "text-teal-600" : ""
            }`}
            onClick={() => {
              setCurrentSorted("service");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Tjänst
            {!column.getIsSorted() ? (
              ""
            ) : column.getIsSorted() === "asc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="text-right">
          <Button
            variant="ghost"
            className={`px-0 gap-0 hover:bg-transparent hover:text-teal-600 ${
              currentSorted === "status" ? "text-teal-600" : ""
            }`}
            onClick={() => {
              setCurrentSorted("status");
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            {!column.getIsSorted() ? (
              ""
            ) : column.getIsSorted() === "asc" ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
            Status
          </Button>
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-right">
          <div
            className={`inline-flex items-center justify-center gap-0.5 py-1 pl-2 pr-3 rounded-full ${
              row.original.status === "Avbokad"
                ? "bg-red-300 text-red-700"
                : row.original.status === "Utgången"
                ? "bg-yellow-300 text-yellow-700"
                : "bg-green-300 text-green-700"
            }`}
          >
            {row.original.status === "Avbokad" ? (
              <BadgeX strokeWidth={1.5} size={16} />
            ) : row.original.status === "Utgången" ? (
              <BadgeMinus strokeWidth={1.5} size={16} />
            ) : (
              <BadgeCheck strokeWidth={1.5} size={16} />
            )}
            <span className="text-xs font-semibold">{row.original.status}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: ({ column }) => {
        return (
          <div className="text-right">
            <Button
              variant="ghost"
              className={`px-0 gap-0 hover:bg-transparent hover:text-teal-600 ${
                currentSorted === "customerName" ? "text-teal-600" : ""
              }`}
              onClick={() => {
                setCurrentSorted("customerName");
                column.toggleSorting(column.getIsSorted() === "asc");
              }}
            >
              {!column.getIsSorted() ? (
                ""
              ) : column.getIsSorted() === "asc" ? (
                <ArrowDown className="h-4 w-4" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
              Kundnamn
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-right">{row.original.customerName}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenuCustom className="border-0 bg-transparent hover:bg-transparent">
            <DropdownMenuItem
              onSelect={() => {
                setCurrentBookingID(row.original.id, true);
                setOpenDialog(true);
              }}
            >
              <CalendarPlus strokeWidth={1.5} />
              Boka igen
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setCurrentBookingID(row.original.id, false);
                setOpenDialog(true);
              }}
            >
              <Info strokeWidth={1.5} />
              Visa info
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setCurrentBookingID(row.original.id, false);
                setOpenAlertDialog(true);
              }}
            >
              <CircleX strokeWidth={1.5} />
              Radera
            </DropdownMenuItem>
          </DropdownMenuCustom>
        );
      },
    },
  ];
}
