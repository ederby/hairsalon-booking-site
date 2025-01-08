import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { ExtraservicesType } from "@/services/types";
import { CircleX, Pencil } from "lucide-react";
import { useDeleteExtraService } from "./useDeleteExtraService";
import Spinner from "@/components/layout/Spinner";
import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import { useState } from "react";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import ExtraServiceEditForm from "./ExtraServiceEditForm";

type ExtraServiceTableItemProps = {
  extraService: ExtraservicesType;
};

export default function ExtraServiceTableItem({
  extraService,
}: ExtraServiceTableItemProps): JSX.Element {
  const { title, price, duration, id } = extraService;
  const { onDeleteExtraService, isDeletingExtraService } =
    useDeleteExtraService();
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openResponsiveDialog, setOpenResponsiveDialog] =
    useState<boolean>(false);

  if (isDeletingExtraService) return <Spinner />;

  return (
    <>
      <TableRow
        className={`${openAlertDialog ? "bg-red-100" : ""} ${
          openResponsiveDialog ? "bg-teal-100" : ""
        }`}
      >
        <TableCell colSpan={2} className="font-medium">
          {title}
        </TableCell>
        <TableCell className="text-right">{price}:-</TableCell>
        <TableCell className="text-right">{duration} min</TableCell>
        <TableCell className="text-right">
          <DropdownMenuCustom className="bg-transparent border-0 hover:bg-transparent">
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
            description="Du håller på att radera denna tilläggstjänst."
            open={openAlertDialog}
            setOpen={setOpenAlertDialog}
            onClick={() => onDeleteExtraService(id)}
            actionText="Radera"
          />

          <ResponsiveDialog
            className="absolute right-10 top-6 h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
            title={`Redigera "${title}"`}
            open={openResponsiveDialog}
            setOpen={setOpenResponsiveDialog}
          >
            <ExtraServiceEditForm extraServiceToEdit={extraService} />
          </ResponsiveDialog>
        </TableCell>
      </TableRow>
    </>
  );
}
