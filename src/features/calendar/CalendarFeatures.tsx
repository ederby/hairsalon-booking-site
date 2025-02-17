import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  CalendarClock,
  CalendarCog,
  CalendarMinus,
  CalendarPlus,
} from "lucide-react";
import { FC, useState } from "react";
import AddBreakForm from "./AddBreakForm";
import RemoveWorkdayForm from "./RemoveWorkdayForm";
import { AddWorkDayForm } from "@/components/layout/AddWorkdayForm";

interface SetupConfigType {
  [key: number]: {
    title: string;
    component: FC;
  };
}

const setupConfig: SetupConfigType = {
  1: {
    title: "Lägg till arbetsdag",
    component: AddWorkDayForm,
  },
  2: {
    title: "Ta bort arbetsdag",
    component: RemoveWorkdayForm,
  },
  3: {
    title: "Lägg till frånvaro",
    component: AddBreakForm,
  },
};

export default function CalendarFeatures() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [setup, setSetup] = useState<number>(0);

  const SetupComponent = setupConfig[setup]?.component || null;
  const setupTitle = setupConfig[setup]?.title || "";

  return (
    <>
      <DropdownMenuCustom
        trigger={
          <Button variant="outline">
            <CalendarCog strokeWidth={1.5} />
            <span>Kalenderhantering</span>
          </Button>
        }
      >
        <DropdownMenuItem
          onSelect={() => {
            setOpenDialog(true);
            setSetup(1);
          }}
        >
          <CalendarPlus strokeWidth={1.5} />
          <span>Lägg till arbetsdag</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setOpenDialog(true);
            setSetup(2);
          }}
        >
          <CalendarMinus strokeWidth={1.5} />
          <span> Ta bort arbetsdag</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setOpenDialog(true);
            setSetup(3);
          }}
        >
          <CalendarClock strokeWidth={1.5} />
          <span>Lägg till frånvaro</span>
        </DropdownMenuItem>
      </DropdownMenuCustom>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>{setupTitle}</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          {SetupComponent && <SetupComponent />}
        </DialogContent>
      </Dialog>
    </>
  );
}
