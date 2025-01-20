import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  const [openDialog, setOpenDialog] = useState<boolean>(false);
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

  // Check if the user clicked on a booking or empty slot
  const isNewBookingMode = !BookingInfo;
  const [openNewBookingDialog, setOpenNewBookingDialog] =
    useState<boolean>(isNewBookingMode);

  const totalPrice = BookingInfo
    ? BookingInfo?.price +
      BookingInfo?.extraServices?.reduce(
        (acc, service) => acc + service.price,
        0
      )
    : 0;

  const formattedCreatedDate = BookingInfo
    ? format(new Date(BookingInfo?.createdAt), "d'e' MMMM yyyy, 'kl.' HH:mm", {
        locale: sv,
      })
    : format(new Date(), "d'e' MMMM yyyy, 'kl.' HH:mm", { locale: sv });

  const formattedBookingDate = format(new Date(StartTime), "d'e' MMMM", {
    locale: sv,
  });

  return (
    <>
      {!isNewBookingMode ? (
        <div className="overflow-hidden rounded mb-1 flex flex-col h-full">
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

          <div className="text-zinc-700 relative px-4 py-2 grow">
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

              <AlertDialogCustom
                title="Är du helt säker?"
                description="Du håller på att radera denna bokning. Du kan inte ångra detta när den har raderats."
                open={openAlertDialog}
                setOpen={setOpenAlertDialog}
                onClick={() => onDeleteBooking(BookingInfo.id)}
                actionText="Radera"
              />

              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger asChild className=""></DialogTrigger>
                <DialogContent className="overflow-y-auto max-h-full">
                  <DialogHeader>
                    <DialogTitle className="hidden">{Subject}</DialogTitle>
                    <DialogDescription className="hidden"></DialogDescription>
                  </DialogHeader>
                  <CalendarEditForm
                    booking={{
                      ...BookingInfo,
                      Subject,
                      StartTime,
                      EndTime,
                      GuestInfo,
                    }}
                    currentStaffMember={currentStaffMember}
                    setOpenDialog={setOpenDialog}
                    isNewBookingMode={isNewBookingMode}
                    startTime={StartTime}
                    endTime={EndTime}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {BookingInfo && BookingInfo.extraServices.length > 0 && (
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

          <div className="flex gap-2 justify-end mt-5 p-4">
            <Button
              onClick={() => {
                setOpenAlertDialog((s) => !s);
                closePopup();
              }}
              variant="outline"
            >
              <CircleX />
              <span>Radera</span>
            </Button>
            <Button
              onClick={() => {
                setOpenDialog((s) => !s);
                closePopup();
              }}
            >
              <Pencil /> <span>Redigera</span>
            </Button>
          </div>
        </div>
      ) : (
        <Dialog
          open={openNewBookingDialog}
          onOpenChange={setOpenNewBookingDialog}
        >
          <DialogTrigger asChild className=""></DialogTrigger>
          <DialogContent className="overflow-y-auto max-h-full">
            <DialogHeader>
              <DialogTitle className="hidden">{Subject}</DialogTitle>
              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>
            <CalendarEditForm
              currentStaffMember={currentStaffMember}
              setOpenDialog={setOpenNewBookingDialog}
              isNewBookingMode={isNewBookingMode}
              startTime={StartTime}
              endTime={EndTime}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
