import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import ListItemSkeleton from "@/components/layout/ListItemSkeleton";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ServicesType } from "@/services/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircleX, GripVertical, Pencil } from "lucide-react";
import { useState } from "react";
import ServiceEditForm from "./ServiceEditForm";
import { useDeleteService } from "./useDeleteService";
import { useEditService } from "./useEditService";
import { useToggleService } from "./useToggleService";

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
  const { onToggleService: toggleService } = useToggleService();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: service.id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function handleChecked(value: boolean) {
    toggleService({ id: service.id, isActive: value });
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`${
        openResponsiveDialog
          ? "bg-teal-100"
          : openAlertDialog
          ? "bg-red-100"
          : "odd:bg-white"
      } flex justify-between items-center w-full py-4 px-3 border-b first:border-t border-zinc-200 border-l border-r transition-all first:rounded-t last:rounded-b relative overflow-hidden`}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 bottom-0 border-r flex justify-center items-center cursor-move touch-none"
      >
        <GripVertical strokeWidth={1} className="text-zinc-500" />
      </div>
      <div data-no-dnd="true" className="flex gap-2 items-center ml-6">
        {isDeletingService || isEditingService ? (
          <ListItemSkeleton hasImage={false} />
        ) : (
          <>
            <Switch
              checked={service.isActive}
              onCheckedChange={handleChecked}
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
              <Pencil strokeWidth={1.5} />
              Redigera
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setOpenAlertDialog((s) => !s);
              }}
            >
              <CircleX strokeWidth={1.5} />
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
