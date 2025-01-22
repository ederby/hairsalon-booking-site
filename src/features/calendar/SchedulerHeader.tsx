import { format } from "date-fns";
import { sv } from "date-fns/locale";
import { X } from "lucide-react";

type SchedulerHeaderProps = {
  color: { primary: string; secondary: string };
  createdDate: string;
  closePopup: () => void;
};

export default function SchedulerHeader({
  color,
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
      className="py-2 px-4 flex justify-between items-center"
      style={{ backgroundColor: color.primary }}
    >
      <span className="font-semibold" style={{ color: color.secondary }}>
        Bokad {formattedCreatedDate}
      </span>
      <X
        size={16}
        color={color.secondary}
        className="cursor-pointer"
        onClick={closePopup}
      />
    </div>
  );
}
