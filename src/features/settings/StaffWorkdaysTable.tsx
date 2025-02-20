import { AddWorkDayForm } from "@/components/layout/AddWorkdayForm";
import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkdayType } from "@/services/types";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  Updater,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

type StaffWorkingdaysTableProps<TData extends WorkdayType, TValue> = {
  columns: (
    setOpenAlertDialog: (open: boolean) => void,
    setOpenDialog: (open: boolean) => void,
    setCurrentWorkdayID: (workdayID: number) => void
  ) => ColumnDef<TData, TValue>[];
  data: TData[];
  handleDelete: (workdayID: number) => void;
  handleSelectedRows: (selectedRows: TData[]) => void;
};

export default function StaffWorkdaysTable<TData extends WorkdayType, TValue>({
  columns,
  data,
  handleDelete,
  handleSelectedRows,
}: StaffWorkingdaysTableProps<TData, TValue>): JSX.Element {
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [currentWorkdayID, setCurrentWorkdayID] = useState(0);

  const table = useReactTable({
    data,
    columns: columns(setOpenAlertDialog, setOpenDialog, setCurrentWorkdayID),
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      rowSelection,
    },
  });
  const currentWorkday = data.find(
    (workday) => workday.id === currentWorkdayID
  );

  function handleRowSelectionChange(
    updaterOrValue: Updater<RowSelectionState>
  ) {
    setRowSelection((prev) => {
      const newRowSelection =
        typeof updaterOrValue === "function"
          ? updaterOrValue(prev)
          : updaterOrValue;

      handleSelectedRows(
        table
          .getRowModel()
          .rows.filter((row) =>
            Object.keys(newRowSelection).includes(row.id.toString())
          )
          .map((row) => row.original)
      );

      return newRowSelection;
    });
  }

  return (
    <div className="rounded-b-md border">
      <Table className="rounded-t-none">
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
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Inga arbetsdagar.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>Redigera arbetsdag</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <AddWorkDayForm currentWorkday={currentWorkday} />
        </DialogContent>
      </Dialog>
      <AlertDialogCustom
        title="Är du helt säker?"
        description="Du håller på att radera denna arbetsdag. Eventuella bokningar kommer finnas kvar på datumet."
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        onClick={() => handleDelete(currentWorkdayID)}
        actionText="Radera"
      />
    </div>
  );
}
