import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCalendar } from "@/context/CalendarContext";
import { CalendarPlus } from "lucide-react";
import BreakForm from "./BreakForm";
import { useEffect } from "react";

export default function CalendarBreakAppointment(): JSX.Element {
  const { currentBookingInfo, currentBookingInfoInitialState } = useCalendar();
  const { openBreakDialog, setOpenBreakDialog } = useCalendar();

  // Reset currentBookingInfo when dialog is closed
  useEffect(() => {
    if (!openBreakDialog) {
      currentBookingInfo.current = currentBookingInfoInitialState;
    }
  }, [currentBookingInfo, currentBookingInfoInitialState, openBreakDialog]);

  return (
    <Dialog open={openBreakDialog} onOpenChange={setOpenBreakDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarPlus strokeWidth={1.5} />
          <span>Lägg till frånvaro</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-full">
        <DialogHeader>
          <DialogTitle className="hidden">Title</DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>
        <BreakForm />
      </DialogContent>
    </Dialog>
  );
}
