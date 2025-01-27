import { Button } from "@/components/ui/button";
import { CalendarX2, Pencil } from "lucide-react";

type SchedulerFooterType = {
  closePopup: () => void;
  setOpenAlertDialog: (s: boolean) => void;
  setOpenDialog: (s: boolean) => void;
};

export default function SchedulerFooter({
  closePopup,
  setOpenAlertDialog,
  setOpenDialog,
}: SchedulerFooterType): JSX.Element {
  return (
    <div className="flex gap-2 justify-end mt-5 py-4">
      <Button
        onClick={() => {
          closePopup();
          setOpenAlertDialog(true);
        }}
        variant="outline"
      >
        <CalendarX2 strokeWidth={1.5} />
        <span>Avboka</span>
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
