import { EventTemplate } from "@/services/types";
import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { X } from "lucide-react";

type SchedulerHeaderProps = {
  bookingInfo: EventTemplate;
  closePopup: () => void;
};

export default function SchedulerHeader({
  bookingInfo,
  closePopup,
}: SchedulerHeaderProps): JSX.Element {
  const formattedCreatedDate = format(
    new Date((bookingInfo.BookingInfo?.createdAt as string) || new Date()),
    "d'e' MMMM yyyy, 'kl.' HH:mm",
    {
      locale: sv,
    }
  );

  const isWorkday =
    bookingInfo.Subject === "Start av dagen" ||
    bookingInfo.Subject === "Slutet av dagen";

  return (
    <div
      className={`py-2 px-4 flex items-center ${
        bookingInfo.Break ? "bg-zinc-600" : "bg-teal-600"
      } ${isWorkday ? "justify-end" : "justify-between"}`}
    >
      {!isWorkday && (
        <span className="font-semibold text-teal-50">
          {bookingInfo.Break ? "Skapad" : "Bokad"} {formattedCreatedDate}
        </span>
      )}
      <X
        size={16}
        className="cursor-pointer text-teal-50"
        onClick={closePopup}
      />
    </div>
  );
}
