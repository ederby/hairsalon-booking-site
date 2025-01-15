import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { CalendarStaffMembers, EventTemplate } from "@/services/types";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { CircleX, Pencil, X } from "lucide-react";
import { useState } from "react";
import CalendarEditForm from "../CalendarEditForm";

type EventPopupType = {
  data: EventTemplate;
  staff: CalendarStaffMembers[];
  onDeleteBooking: (id: number) => void;
  closePopup: () => void;
};

export function EventPopup({
  data,
  staff,
  onDeleteBooking,
  closePopup,
}: EventPopupType): JSX.Element {
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openResponsiveDialog, setOpenResponsiveDialog] =
    useState<boolean>(false);
  const {
    Subject,
    StartTime,
    EndTime,
    GuestInfo,
    StaffColor,
    SecondStaffColor,
    BookingInfo,
  } = data;
  const currentStaffMember = staff.find(
    (member) => member.id === data.ResourceId
  );

  const totalPrice =
    BookingInfo?.price +
    BookingInfo?.extraServices?.reduce(
      (acc, service) => acc + service.price,
      0
    );
  const formattedCreatedDate = format(
    new Date(BookingInfo?.createdAt),
    "d'e' MMMM yyyy, 'kl.' HH:mm",
    { locale: sv }
  );
  const formattedBookingDate = format(new Date(StartTime), "d'e' MMMM", {
    locale: sv,
  });

  return (
    <div className="overflow-hidden rounded mb-1">
      <div
        className="py-2 px-4 flex justify-between items-center"
        style={{ backgroundColor: StaffColor }}
      >
        <span className="font-semibold" style={{ color: SecondStaffColor }}>
          Bokad {formattedCreatedDate}
        </span>
        <X
          size={16}
          color={SecondStaffColor}
          className="cursor-pointer"
          onClick={closePopup}
        />
      </div>

      <div className="text-zinc-700 relative px-4 py-2">
        <div className="flex items-center gap-1 justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h3 className="scroll-m-20 text-sm font-semibold tracking-tight leading-6">
                {Subject}
              </h3>
              <p className="text-zinc-500 mt-[-3px]">
                {currentStaffMember?.text}
              </p>
            </div>
          </div>

          <DropdownMenuCustom className="">
            <DropdownMenuItem
              onSelect={() => setOpenResponsiveDialog((s) => !s)}
            >
              <Pencil />
              Redigera
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setOpenAlertDialog((s) => !s)}>
              <CircleX />
              Radera
            </DropdownMenuItem>
          </DropdownMenuCustom>

          <AlertDialogCustom
            title="Är du helt säker?"
            description="Du håller på att radera denna bokning. Du kan inte ångra detta när den har raderats."
            open={openAlertDialog}
            setOpen={setOpenAlertDialog}
            onClick={() => onDeleteBooking(BookingInfo.id)}
            actionText="Radera"
          />

          <ResponsiveDialog
            className="absolute right-10 top-6 h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
            title={`Redigera bokning`}
            open={openResponsiveDialog}
            setOpen={setOpenResponsiveDialog}
          >
            <CalendarEditForm
              booking={{
                ...BookingInfo,
                Subject,
                StartTime,
                EndTime,
                GuestInfo,
              }}
              currentStaffMember={currentStaffMember}
            />
          </ResponsiveDialog>
        </div>

        {BookingInfo.extraServices.length > 0 && (
          <>
            <Separator className="mt-2 mb-3" />
            <div className="w-full flex justify-between items-start">
              <span className="text-zinc-400">Extratjänster</span>
              <div className="flex flex-col text-right">
                {BookingInfo.extraServices.map((service) => (
                  <span key={service.id}>{service.title}</span>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator className="my-3" />

        <div className="mt-2 flex flex-col gap-1.5">
          <div className="w-full flex justify-between items-center">
            <span className="text-zinc-400">Datum</span>
            <span>{formattedBookingDate}</span>
          </div>

          <div className="w-full flex justify-between items-center">
            <span className="text-zinc-400">Tid</span>
            <span>
              {BookingInfo.startTime} - {BookingInfo.endTime}
            </span>
          </div>

          <div className="w-full flex justify-between items-center">
            <span className="text-zinc-400">Totalpris</span>
            <span>{totalPrice} kr</span>
          </div>
        </div>

        <Separator className="my-3" />

        <div className="mt-2 flex flex-col gap-1.5">
          <div className="w-full flex justify-between items-center">
            <span className="text-zinc-400">Bokare</span>
            <span>{GuestInfo?.name}</span>
          </div>

          <div className="w-full flex justify-between items-center">
            <span className="text-zinc-400">Email</span>
            <span>{GuestInfo?.email}</span>
          </div>

          <div className="w-full flex justify-between items-center">
            <span className="text-zinc-400">Tel</span>
            <span>{GuestInfo?.phone}</span>
          </div>

          {GuestInfo?.observations && (
            <div className="w-full flex justify-between items-center">
              <span className="text-zinc-400">Obs</span>
              <span>{GuestInfo?.observations}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
