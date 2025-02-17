import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkdayType } from "@/services/types";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarClock, CircleX, MoreVertical } from "lucide-react";

export const staffWorkdayColumns = (
  setOpenAlertDialog: (open: boolean) => void,
  setOpenDialog: (open: boolean) => void,
  setCurrentWorkdayID: (workdayID: number) => void
): ColumnDef<WorkdayType>[] => [
  {
    accessorKey: "date",
    header: "Datum",
  },
  {
    accessorKey: "weekday",
    header: "Veckodag",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const weekday = date.toLocaleDateString("sv-SE", { weekday: "long" });
      return <div>{weekday.charAt(0).toUpperCase() + weekday.slice(1)}</div>;
    },
  },
  {
    accessorKey: "startTime",
    header: () => {
      return (
        <div className="text-right">
          <span>Börjar</span>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-right">{row.original.startTime}</div>;
    },
  },
  {
    accessorKey: "endTime",
    header: () => {
      return (
        <div className="text-right">
          <span>Slutar</span>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-right">{row.original.endTime}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const workdayID = row.original.id;

      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:bg-transparent"
              >
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end">
              <DropdownMenuItem
                onClick={() => {
                  setOpenDialog(true);
                  setCurrentWorkdayID(workdayID);
                }}
              >
                <CalendarClock strokeWidth={1.5} />
                Redigera
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setOpenAlertDialog(true);
                  setCurrentWorkdayID(workdayID);
                }}
              >
                <CircleX strokeWidth={1.5} />
                Radera
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
