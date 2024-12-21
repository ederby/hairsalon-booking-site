import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { CircleX, Pencil } from "lucide-react";
import { ServicesType } from "@/services/types";

type ServiceListItemProps = {
  service: ServicesType;
};

export default function ServiceListItem({
  service,
}: ServiceListItemProps): JSX.Element {
  return (
    <div className="flex justify-between items-center w-full py-4 px-2 border-b last:border-b-0 first:border-t border-zinc-200 odd:bg-zinc-50">
      <span>{service.title}</span>

      <DropdownMenuCustom className="border-0 bg-zinc-100 bg-transparent hover:bg-transparent">
        <DropdownMenuItem onSelect={() => {}}>
          <Pencil />
          Redigera
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => {}}>
          <CircleX />
          Radera
        </DropdownMenuItem>
      </DropdownMenuCustom>
    </div>
  );
}
