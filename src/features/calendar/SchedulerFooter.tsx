import { Button } from "@/components/ui/button";
import { CalendarX2, Pencil } from "lucide-react";

type SchedulerFooterType = {
  closePopup: () => void;
  setOpenAlertDialog: (s: boolean) => void;
  setOpenDialog: (s: boolean) => void;
  isWorkday: boolean;
  isBreak: boolean;
};

export default function SchedulerFooter({
  closePopup,
  setOpenAlertDialog,
  setOpenDialog,
  isWorkday,
  isBreak,
}: SchedulerFooterType): JSX.Element | null {
  if (isWorkday) return null;

  return (
    <div className="flex gap-2 justify-end py-4 px-4">
      <Button
        onClick={() => {
          closePopup();
          setOpenAlertDialog(true);
        }}
        variant="outline"
      >
        <CalendarX2 strokeWidth={1.5} />
        <span>{isBreak ? "Ta bort" : "Avboka"}</span>
      </Button>
      <Button
        onClick={() => {
          closePopup();
          setOpenDialog(true);
        }}
      >
        <Pencil /> <span>Redigera</span>
      </Button>
    </div>
  );
}
