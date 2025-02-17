import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarPlus } from "lucide-react";
import { useState } from "react";
import AddWorkdaysForm from "./AddWorkdaysForm";

export default function AddWorkdaysBulk({
  staffID,
}: {
  staffID: number;
}): JSX.Element {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <CalendarPlus strokeWidth={1.5} />
            Lägg till
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>Lägg till arbetsdagar</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <AddWorkdaysForm staffID={staffID} />
        </DialogContent>
      </Dialog>
    </>
  );
}
