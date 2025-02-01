import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { X } from "lucide-react";

type SchedulerHeaderProps = {
  breakBooking: boolean;
  createdDate: string;
  closePopup: () => void;
};

export default function SchedulerHeader({
  breakBooking,
  createdDate,
  closePopup,
}: SchedulerHeaderProps): JSX.Element {
  const formattedCreatedDate = format(
    new Date(createdDate),
    "d'e' MMMM yyyy, 'kl.' HH:mm",
    {
      locale: sv,
    }
  );

  return (
    <div
      className={`py-2 px-4 flex justify-between items-center ${
        breakBooking ? "bg-zinc-600" : "bg-teal-600"
      }`}
    >
      <span className="font-semibold text-teal-50">
        {breakBooking ? "Skapad" : "Bokad"} {formattedCreatedDate}
      </span>
      <X
        size={16}
        className="cursor-pointer text-teal-50"
        onClick={closePopup}
      />
    </div>
  );
}
