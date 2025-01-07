import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { ExtraservicesType } from "@/services/types";
import { CircleX, Pencil } from "lucide-react";

type ExtraServiceTableItemProps = {
  extraService: ExtraservicesType;
};

export default function ExtraServiceTableItem({
  extraService,
}: ExtraServiceTableItemProps): JSX.Element {
  const { title, price, duration } = extraService;
  return (
    <TableRow>
      <TableCell colSpan={2} className="font-medium">
        {title}
      </TableCell>
      <TableCell>{price}</TableCell>
      <TableCell>{duration}</TableCell>
      <TableCell className="text-right">
        <DropdownMenuCustom className="bg-transparent border-0 hover:bg-transparent">
          <DropdownMenuItem onSelect={() => {}}>
            <Pencil />
            Redigera
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => {}}>
            <CircleX />
            Radera
          </DropdownMenuItem>
        </DropdownMenuCustom>
      </TableCell>
    </TableRow>
  );
}
