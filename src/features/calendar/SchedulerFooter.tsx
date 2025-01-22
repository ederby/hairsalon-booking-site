import { Button } from "@/components/ui/button";
import { CircleX, Pencil } from "lucide-react";

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
        <CircleX />
        <span>Radera</span>
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
