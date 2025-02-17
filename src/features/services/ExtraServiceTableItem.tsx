import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import Spinner from "@/components/layout/Spinner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { ExtraservicesType } from "@/services/types";
import { CircleX, EyeIcon, EyeOff, Pencil } from "lucide-react";
import { useState } from "react";
import AddExtraserviceForm from "./AddExtraserviceForm";
import { useDeleteExtraService } from "./useDeleteExtraService";
import { useToggleExtraService } from "./useToggleExtraService";

type ExtraServiceTableItemProps = {
  extraService: ExtraservicesType;
};

export default function ExtraServiceTableItem({
  extraService,
}: ExtraServiceTableItemProps): JSX.Element {
  const { title, price, duration, id, isActive } = extraService;
  const { onDeleteExtraService, isDeletingExtraService } =
    useDeleteExtraService();
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openResponsiveDialog, setOpenResponsiveDialog] =
    useState<boolean>(false);
  const { onToggleExtraService } = useToggleExtraService();

  if (isDeletingExtraService) return <Spinner />;

  return (
    <TableRow
      className={`${openAlertDialog ? "bg-red-100" : ""} ${
        openResponsiveDialog ? "bg-teal-100" : ""
      }`}
    >
      <TableCell colSpan={2} className="font-medium">
        <span
          className={`${
            !isActive ? "text-zinc-500" : ""
          } flex items-center gap-1`}
        >
          {title} {!isActive && <EyeOff size={16} />}
        </span>
      </TableCell>
      <TableCell className="text-right">
        {isActive && <span>{price}:-</span>}
      </TableCell>
      <TableCell className="text-right">
        {isActive && <span>{duration} min</span>}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenuCustom className="bg-transparent border-0 hover:bg-transparent">
          {isActive && (
            <DropdownMenuItem
              onSelect={() => setOpenResponsiveDialog((s) => !s)}
            >
              <Pencil strokeWidth={1.5} />
              Redigera
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={() => setOpenAlertDialog((s) => !s)}>
            <CircleX strokeWidth={1.5} />
            Radera
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => onToggleExtraService({ id, toggle: !isActive })}
          >
            {isActive ? (
              <>
                <EyeOff />
                <span>Dölj</span>
              </>
            ) : (
              <>
                <EyeIcon />
                <span>Visa</span>
              </>
            )}
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
          <AddExtraserviceForm extraServiceToEdit={extraService} />
        </ResponsiveDialog>
      </TableCell>
    </TableRow>
  );
}
