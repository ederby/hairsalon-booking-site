import Spinner from "@/components/layout/Spinner";
import { useWorkdays } from "@/hooks/useWorkdays";
import { staffWorkdayColumns } from "./StaffWorkdayColumns";
import StaffWorkdaysTable from "./StaffWorkdaysTable";
import { useDeleteWorkdayByDate } from "./useDeleteWorkday";
import AddWorkdaysBulk from "./AddWorkdaysBulk";
import { Separator } from "@/components/ui/separator";

type StaffWorkdaysProps = {
  staffID: number;
};

function isCurrentWeekOrLater(date: Date): boolean {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  return date >= startOfWeek;
}

export default function StaffWorkdays({
  staffID,
}: StaffWorkdaysProps): JSX.Element {
  const { workdays, isLoadingWorkdays } = useWorkdays();
  const workdaysByCurrentStaff = workdays
    ?.filter((workday) => workday.staffID === staffID)
    .filter((workday) => isCurrentWeekOrLater(new Date(workday.date)));
  const { onDeleteWorkdayByDate } = useDeleteWorkdayByDate();

  function handleDelete(workdayID: number) {
    onDeleteWorkdayByDate(workdayID);
  }

  if (isLoadingWorkdays) return <Spinner />;

  return (
    <div>
      <Separator className="mb-4" />
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-lg font-semibold mb-2">Arbetstider</h3>
        <AddWorkdaysBulk staffID={staffID} />
      </div>
      <div>
        <StaffWorkdaysTable
          columns={staffWorkdayColumns}
          data={workdaysByCurrentStaff ?? []}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}
