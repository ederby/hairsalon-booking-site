import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { StaffType } from "@/services/types";
import { UserPen } from "lucide-react";
import { useToggleActiveStaff } from "./useToggleActiveStaff";

type StaffInfoProps = {
  currentStaff: StaffType;
  setOpenDialog: (value: boolean) => void;
};

export default function StaffInfo({
  currentStaff,
  setOpenDialog,
}: StaffInfoProps): JSX.Element {
  const { onToggleActiveStaff } = useToggleActiveStaff();

  function formatPhoneNumber(phoneNumber: string) {
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{2})(\d{2})/, "$1-$2 $3 $4");
  }

  return (
    <Card className="mt-4 p-4">
      <div className="flex justify-between place-items-start">
        <div className="flex items-center gap-2">
          <div className="rounded-xl overflow-hidden w-20 h-20">
            {currentStaff?.image ? (
              <img
                className={`object-cover transition-all hover:scale-105 aspect-square max-w-20 ${
                  !currentStaff.isActive ? "filter grayscale opacity-80" : ""
                }`}
                src={currentStaff?.image}
                alt={currentStaff?.name}
              />
            ) : (
              <div className="bg-zinc-200 w-full h-full flex items-center justify-center">
                <span className="text-white text-3xl">
                  {currentStaff?.name.split(" ").map((n) => n[0])}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold leading-5">
              {currentStaff?.name}
            </h3>
            <h5 className="text-sm font-medium leading-none">
              {currentStaff?.role}
            </h5>
          </div>
        </div>
        <div>
          <Button variant="outline" onClick={() => setOpenDialog(true)}>
            <UserPen strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <div>
        <div className="mt-4 flex gap-4 flex-wrap">
          <div className="min-w-36">
            <h5 className="text-sm text-zinc-400 font-medium">Email</h5>
            <p className="text-sm">{currentStaff?.email}</p>
          </div>
          <div className="min-w-36">
            <h5 className="text-sm text-zinc-400 font-medium">Tel</h5>
            <p className="text-sm">
              {currentStaff?.phone && formatPhoneNumber(currentStaff.phone)}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-3" />

      <div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Aktiv</span>
          <Switch
            checked={currentStaff?.isActive}
            onCheckedChange={(e) =>
              onToggleActiveStaff({ isActive: e, id: currentStaff?.id })
            }
          />
        </div>
      </div>
    </Card>
  );
}
