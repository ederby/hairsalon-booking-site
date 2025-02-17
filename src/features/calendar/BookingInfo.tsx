import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBookingHistory } from "@/context/BookingHistoryContext";
import { useStaff } from "@/hooks/useStaff";
import { BookingType } from "@/services/types";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { BadgeCheck, BadgeMinus, BadgeX, CalendarPlus } from "lucide-react";

type BookingInfoProps = {
  booking: BookingType | undefined;
};

export default function BookingInfo({
  booking,
}: BookingInfoProps): JSX.Element {
  const { setCurrentBookingID } = useBookingHistory();
  const { staff, isLoadingStaff } = useStaff();
  const currentStaff = staff?.find((s) => s.id === booking?.staff_id);
  const outdated =
    (booking?.selectedDate &&
      booking.selectedDate < format(new Date(), "yyyy-MM-dd")) ||
    (booking?.selectedDate &&
      booking.selectedDate !== format(new Date(), "yyyy-MM-dd"));

  if (isLoadingStaff) return <Spinner />;

  return (
    <div>
      <div className="flex gap-2">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Bokning #{booking?.id}
        </h3>
        <div
          className={`inline-flex items-center gap-1.5 py-1 pl-3 pr-4 rounded-full ${
            booking?.canceled
              ? "bg-red-300 text-red-700"
              : outdated
              ? "bg-yellow-300 text-yellow-700"
              : "bg-green-300 text-green-700"
          }`}
        >
          {booking?.canceled ? (
            <BadgeX strokeWidth={1.5} size={18} />
          ) : outdated ? (
            <BadgeMinus strokeWidth={1.5} size={18} />
          ) : (
            <BadgeCheck strokeWidth={1.5} size={18} />
          )}
          <span className="text-sm font-semibold">
            {booking?.canceled ? "Avbokad" : outdated ? "Utgången" : "Bokad"}
          </span>
        </div>
      </div>

      <Card className="p-4 mt-4 flex flex-col gap-2.5">
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Kategori</h4>
          <h4>{booking?.category?.title}</h4>
        </div>
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Tjänst</h4>
          <h4>{booking?.service?.title}</h4>
        </div>
        {booking?.extraServices && booking?.extraServices.length > 0 && (
          <div className="flex justify-between text-sm">
            <h4 className="text-zinc-400">Extratjänster</h4>
            <div className="text-right">
              {booking?.extraServices.map((extraService) => (
                <h4 key={extraService.id}>{extraService.title}</h4>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Skapad</h4>
          <h4>
            {format(booking?.created_at ?? new Date(), "d MMMM yyyy", {
              locale: sv,
            })}
          </h4>
        </div>
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Personal</h4>
          <h4>{currentStaff?.name}</h4>
        </div>
      </Card>

      <Card className="p-4 mt-4 flex flex-col gap-2.5">
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Datum</h4>
          <h4>
            {format(booking?.selectedDate ?? new Date(), "d MMMM yyyy", {
              locale: sv,
            })}
          </h4>
        </div>
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Tid</h4>
          <h4>
            {booking?.startTime} – {booking?.endTime}
          </h4>
        </div>
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Tidåtgång</h4>
          <h4>{booking?.duration} min</h4>
        </div>
      </Card>

      <Card className="p-4 mt-4 flex flex-col gap-2.5">
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Kund</h4>
          <h4>{booking?.guestInfo.name}</h4>
        </div>
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Email</h4>
          <h4>{booking?.guestInfo.email}</h4>
        </div>
        <div className="flex justify-between text-sm">
          <h4 className="text-zinc-400">Telefon</h4>
          <h4>{booking?.guestInfo.phone}</h4>
        </div>
        {booking?.guestInfo.observations && (
          <div className="flex justify-between text-sm">
            <h4 className="text-zinc-400">Observation</h4>
            <h4>{booking?.guestInfo.observations}</h4>
          </div>
        )}
      </Card>

      <div className="w-full flex justify-end gap-2.5 mt-6">
        <Button variant="outline">Radera</Button>
        <Button
          onClick={() => {
            setCurrentBookingID(booking?.id ?? -1, true);
          }}
        >
          <CalendarPlus strokeWidth={1.5} />
          Boka igen
        </Button>
      </div>
    </div>
  );
}
