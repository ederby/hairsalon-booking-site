import Spinner from "@/components/layout/Spinner";
import StaffDropdown from "@/components/layout/StaffDropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStaff } from "@/hooks/useStaff";
import { useState } from "react";
import AddStaffForm from "./AddStaffForm";
import StaffInfo from "./StaffInfo";
import StaffWorkdays from "./StaffWorkdays";

export default function SettingsStaff() {
  const [selectedStaff, setSelectedStaff] = useState(2);
  const [openDialog, setOpenDialog] = useState(false);
  const { staff, isLoadingStaff } = useStaff();

  const currentStaff = staff?.find((s) => s.id === selectedStaff);

  if (isLoadingStaff) return <Spinner />;

  return (
    <>
      <div className="space-y-4">
        <div>
          <StaffDropdown
            selectedStaff={selectedStaff}
            onSelect={setSelectedStaff}
          />
        </div>

        {currentStaff && (
          <StaffInfo
            currentStaff={currentStaff}
            setOpenDialog={setOpenDialog}
          />
        )}
        {currentStaff?.isActive && (
          <StaffWorkdays staffID={currentStaff?.id ?? 0} />
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>Ändra personlig information</DialogTitle>
            <DialogDescription className="hidden"></DialogDescription>
          </DialogHeader>
          <AddStaffForm staff={currentStaff} />
        </DialogContent>
      </Dialog>
    </>
  );
}
