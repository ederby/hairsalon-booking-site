import AlertDialogCustom from "@/components/layout/AlertDialogCustom";
import DropdownMenuCustom from "@/components/layout/DropdownMenuCustom";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import Spinner from "@/components/layout/Spinner";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import CategoryEditForm from "@/features/services/CategoryEditForm";
import CategoryListItemSkeleton from "@/features/services/CategoryListItemSkeleton";
import {
  CategoryListType,
  CategoryUpdateType,
  ServicesType,
} from "@/services/types";
import { CircleX, Pencil } from "lucide-react";
import { useState } from "react";

type CategoryListItemProps = {
  children?: React.ReactNode;
  updateHandler: (category: CategoryUpdateType) => void;
  deleteHandler: (id: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  data: ServicesType | CategoryListType;
};

function hasImageProperty(
  data: ServicesType | CategoryListType
): data is CategoryListType {
  return (data as CategoryListType).image !== undefined;
}

export default function ListItem({
  data,
  children,
  updateHandler,
  deleteHandler,
  isUpdating,
  isDeleting,
}: CategoryListItemProps): JSX.Element {
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openResponsiveDialog, setOpenResponsiveDialog] =
    useState<boolean>(false);

  if (isDeleting) return <Spinner />;

  return (
    <AccordionItem
      value={data.title}
      className={`${openAlertDialog ? "bg-red-100" : ""} ${
        openResponsiveDialog ? "bg-teal-100" : ""
      } hover:bg-teal-50 px-2 relative data-[state=open]:bg-zinc-100`}
    >
      <AccordionTrigger>
        {isUpdating ? (
          <CategoryListItemSkeleton />
        ) : (
          <div className="flex items-center gap-2">
            {hasImageProperty(data) && (
              <div className="h-12 w-12 min-h-12 min-w-12 rounded overflow-hidden">
                <img src={data.image} alt={data.title} />
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-base">{data.title}</span>
            </div>
          </div>
        )}
      </AccordionTrigger>

      <ResponsiveDialog
        className="absolute right-10 top-6 h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
        title={`Redigera ${data.title}`}
        open={openResponsiveDialog}
        setOpen={setOpenResponsiveDialog}
      >
        <CategoryEditForm
          categoryToEdit={{
            title: data.title,
            description: data.description,
            id: data.id,
          }}
          onHandleCategory={updateHandler}
        />
      </ResponsiveDialog>

      <DropdownMenuCustom className="absolute right-10 top-6">
        <DropdownMenuItem onSelect={() => setOpenResponsiveDialog((s) => !s)}>
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
        description="Du håller på att radera denna kategori. Om du raderar denna kategori
            så försvinner också alla tjänster som är koppplade till den."
        open={openAlertDialog}
        setOpen={setOpenAlertDialog}
        onClick={() => deleteHandler(data.id)}
        actionText="Radera"
      />
      <AccordionContent className="pb-0">{children}</AccordionContent>
    </AccordionItem>
  );
}
