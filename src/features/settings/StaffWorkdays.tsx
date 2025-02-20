import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { useWorkdays } from "@/hooks/useWorkdays";
import { WorkdayType } from "@/services/types";
import { addMonths, format, isSameMonth, subMonths } from "date-fns";
import { sv } from "date-fns/locale";
import { CalendarMinus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import AddWorkdaysBulk from "./AddWorkdaysBulk";
import { staffWorkdayColumns } from "./StaffWorkdayColumns";
import StaffWorkdaysTable from "./StaffWorkdaysTable";
import { useDeleteWorkdayByDate } from "./useDeleteWorkday";
import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import { useDeleteWorkdays } from "./useDeleteWorkdays";
import { capitalizeFirstLetter } from "@/lib/helpers";

type StaffWorkdaysProps = {
  staffID: number;
};

function isCurrentMonth(date: Date, currentMonth: Date): boolean {
  return isSameMonth(date, currentMonth);
}

export default function StaffWorkdays({
  staffID,
}: StaffWorkdaysProps): JSX.Element {
  const { workdays, isLoadingWorkdays } = useWorkdays();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [workdaysToDelete, setWorkdaysToDelete] = useState<number[]>([]);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);

  const { onDeleteWorkdays } = useDeleteWorkdays();

  const workdaysByCurrentStaff = workdays
    ?.filter((workday) => workday.staffID === staffID)
    .filter((workday) => isCurrentMonth(new Date(workday.date), currentMonth));

  const { onDeleteWorkdayByDate } = useDeleteWorkdayByDate();

  function handleDelete(workdayID: number) {
    onDeleteWorkdayByDate(workdayID);
  }
  function handlePreviousMonth() {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  }
  function handleNextMonth() {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  }

  function handleSelectedRows(selectedRows: WorkdayType[]) {
    const workdaysToDelete = selectedRows.map((row) => row.id);
    setWorkdaysToDelete(workdaysToDelete);
  }
  function handleDeleteSelectedRows() {
    onDeleteWorkdays(workdaysToDelete);
  }

  if (isLoadingWorkdays) return <Spinner />;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-lg font-semibold mb-2">Arbetstider</h3>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setOpenAlertDialog(true)}
            disabled={workdaysToDelete.length === 0}
          >
            <CalendarMinus strokeWidth={1.5} />
            Radera
          </Button>
          <AddWorkdaysBulk staffID={staffID} />
        </div>
      </div>
      <div className="flex justify-between items-center p-2 border-zinc-200 border border-b-0 rounded-t-md">
        <Button
          variant="outline"
          onClick={handlePreviousMonth}
          className="px-3"
        >
          <ChevronLeft strokeWidth={1.5} />
        </Button>
        <span className="text-sm">
          {capitalizeFirstLetter(
            format(currentMonth, "MMMM yyyy", { locale: sv })
          )}
        </span>
        <Button variant="outline" onClick={handleNextMonth} className="px-3">
          <ChevronRight strokeWidth={1.5} />
        </Button>
      </div>
      <div>
        <StaffWorkdaysTable
          columns={staffWorkdayColumns}
          data={workdaysByCurrentStaff ?? []}
          handleDelete={handleDelete}
          handleSelectedRows={handleSelectedRows}
        />
      </div>

      <AlertDialogCustom
        title="Är du helt säker?"
        description="Du håller på att radera dessa arbetsdagar. Bokningarna på det valda dagarna kommer finnas kvar."
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        onClick={handleDeleteSelectedRows}
        actionText="Radera"
      />
    </div>
  );
}
