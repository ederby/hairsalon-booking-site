import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import Spinner from "@/components/layout/Spinner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ServicesType } from "@/services/types";
import { CircleX, Pencil } from "lucide-react";
import { useState } from "react";
import ServiceEditForm from "./ServiceEditForm";
import { useEditService } from "./useEditService";
import { useDeleteService } from "./useDeleteService";
import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import ListItemSkeleton from "@/components/layout/ListItemSkeleton";

type ServiceListItemProps = {
  service: ServicesType;
};

export default function ServiceListItem({
  service,
}: ServiceListItemProps): JSX.Element {
  const [openResponsiveDialog, setOpenResponsiveDialog] =
    useState<boolean>(false);
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const { onEditService, isEditingService } = useEditService();
  const { onDeleteService, isDeletingService } = useDeleteService();

  if (isEditingService) return <Spinner />;
  if (isDeletingService) return <ListItemSkeleton />;

  return (
    <div
      className={`${
        openResponsiveDialog
          ? "bg-teal-100"
          : openAlertDialog
          ? "bg-red-100"
          : "odd:bg-zinc-50"
      } flex justify-between items-center w-full py-4 px-2 border-b last:border-b-0 first:border-t border-zinc-200`}
    >
      <span>{service.title}</span>

      <ResponsiveDialog
        className="h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
        title={`Redigera "${service.title}"`}
        open={openResponsiveDialog}
        setOpen={setOpenResponsiveDialog}
      >
        <ServiceEditForm
          serviceToEdit={service}
          onHandleService={onEditService}
        />
      </ResponsiveDialog>

      <DropdownMenuCustom className="border-0 bg-zinc-100 bg-transparent hover:bg-transparent">
        <DropdownMenuItem
          onSelect={() => {
            setOpenResponsiveDialog((s) => !s);
          }}
        >
          <Pencil />
          Redigera
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            setOpenAlertDialog((s) => !s);
          }}
        >
          <CircleX />
          Radera
        </DropdownMenuItem>
      </DropdownMenuCustom>

      <AlertDialogCustom
        title="Är du helt säker?"
        description="Du håller på att radera denna tjänst och det går inte ångra"
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        onClick={() => onDeleteService(service.id)}
        actionText="Radera"
      />
    </div>
  );
}
