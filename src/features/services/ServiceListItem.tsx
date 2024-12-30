import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import ListItemSkeleton from "@/components/layout/ListItemSkeleton";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
// import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ServicesType } from "@/services/types";
import { CircleX, Pencil } from "lucide-react";
import { useState } from "react";
import ServiceEditForm from "./ServiceEditForm";
import { useDeleteService } from "./useDeleteService";
import { useEditService } from "./useEditService";
import { useToggleService } from "./useToggleService";
import { Switch } from "@/components/ui/switch";

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
  const { onToggleService } = useToggleService();

  function handleChecked(value: boolean) {
    onToggleService({ id: service.id, isActive: value });
  }

  return (
    <li
      className={`${
        openResponsiveDialog
          ? "bg-teal-100"
          : openAlertDialog
          ? "bg-red-100"
          : "odd:bg-zinc-50"
      } flex justify-between items-center w-full py-4 px-3 border-b first:border-t border-zinc-200 border-l border-r transition-all first:rounded-t last:rounded-b`}
    >
      <div className="flex gap-2 items-center">
        {isDeletingService || isEditingService ? (
          <ListItemSkeleton hasImage={false} />
        ) : (
          <>
            {/* <Checkbox
              checked={service.isActive}
              onCheckedChange={handleChecked}
              id="terms"
              className={`${
                !service.isActive ? "border-zinc-400" : ""
              } data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600 shadow-none`}
            /> */}
            <Switch
              checked={service.isActive}
              onCheckedChange={handleChecked}
              className="data-[state=checked]:bg-teal-600"
            />
            <span className={`${!service.isActive ? "text-zinc-600" : ""}`}>
              {service.title}
            </span>
          </>
        )}
      </div>

      {service.isActive && (
        <>
          <ResponsiveDialog
            className="h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
            title={`Redigera "${service.title}"`}
            open={openResponsiveDialog}
            setOpen={setOpenResponsiveDialog}
          >
            <ServiceEditForm
              serviceToEdit={service}
              onHandleService={onEditService}
              categoryID={-1}
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
        </>
      )}
    </li>
  );
}
