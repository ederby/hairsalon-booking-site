import { Separator } from "@/components/ui/separator";
import { useStaff } from "@/hooks/useStaff";
import { ExtraservicesType, GuestInfoType } from "@/services/types";
import { format } from "date-fns";
import { sv } from "date-fns/locale";

type SchedulerContentType = {
  bookingInfo: {
    extraServices: ExtraservicesType[] | [];
    guestInfo: GuestInfoType;
    price: number;
    resourceID: number;
    subject: string;
    startTime: string;
    endTime: string;
    breakBooking: boolean;
  };
};

export default function SchedulerContent({
  bookingInfo,
}: SchedulerContentType): JSX.Element {
  const { staff } = useStaff();

  const currentStaffMember = staff?.find(
    (member) => member.id === bookingInfo.resourceID
  );

  const formattedBookingDate = format(
    new Date(bookingInfo.startTime),
    "d'e' MMMM",
    {
      locale: sv,
    }
  );

  const totalPrice = bookingInfo
    ? bookingInfo.price +
      bookingInfo.extraServices?.reduce(
        (acc, service) => acc + service.price,
        0
      )
    : 0;

  const isWorkday =
    bookingInfo.subject === "Start av dagen" ||
    bookingInfo.subject === "Slutet av dagen";

  return (
    <div className="text-zinc-700 relative py-2 grow">
      <div className="flex items-center gap-1 justify-between">
        <div className="flex flex-col gap-2">
          <div>
            <h3 className="scroll-m-20 text-sm font-semibold tracking-tight leading-6">
              {bookingInfo.subject}
            </h3>
            <p className="text-zinc-500 mt-[-3px]">
              {currentStaffMember?.name}
            </p>
          </div>
          {bookingInfo.breakBooking && bookingInfo.guestInfo.name && (
            <span className="">{bookingInfo.guestInfo.name}</span>
          )}
        </div>
      </div>

      {bookingInfo && bookingInfo.extraServices.length > 0 && (
        <>
          <Separator className="mt-2 mb-3" />
          <div className="w-full flex justify-between items-start">
            <span className="text-zinc-400">Extratjänster</span>
            <div className="flex flex-col text-right">
              {bookingInfo.extraServices.map((service) => (
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
          {!isWorkday ? (
            <span>
              {format(bookingInfo.startTime, "HH:mm")} -{" "}
              {format(bookingInfo.endTime, "HH:mm")}
            </span>
          ) : (
            <span>{format(bookingInfo.endTime, "HH:mm")}</span>
          )}
        </div>

        {!bookingInfo.breakBooking && !isWorkday && (
          <div className="w-full flex justify-between items-center">
            <span className="text-zinc-400">Totalpris</span>
            <span>{totalPrice} kr</span>
          </div>
        )}
      </div>
      {!bookingInfo.breakBooking && !isWorkday && (
        <>
          <Separator className="my-3" />

          <div className="mt-2 flex flex-col gap-1.5">
            <div className="w-full flex justify-between items-center">
              <span className="text-zinc-400">Bokare</span>
              <span>{bookingInfo.guestInfo.name}</span>
            </div>

            <div className="w-full flex justify-between items-center">
              <span className="text-zinc-400">Email</span>
              <span>{bookingInfo.guestInfo.email}</span>
            </div>

            <div className="w-full flex justify-between items-center">
              <span className="text-zinc-400">Tel</span>
              <span>{bookingInfo.guestInfo?.phone}</span>
            </div>

            {bookingInfo.guestInfo.observations && (
              <div className="w-full flex justify-between items-center">
                <span className="text-zinc-400">Obs</span>
                <span>{bookingInfo.guestInfo.observations}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
