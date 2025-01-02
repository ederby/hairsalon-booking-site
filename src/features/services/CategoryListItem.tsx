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
import { CircleX, GripVertical, Pencil } from "lucide-react";
import { useState } from "react";
import CategoryEditForm from "./CategoryEditForm";
import ListItemSkeleton from "../../components/layout/ListItemSkeleton";
import ServiceList from "./ServiceList";
import { useDeleteCategory } from "./useDeleteCategory";
import { useEditCategories } from "./useEditCategories";
import { useQueryClient } from "@tanstack/react-query";
import { getServicesByCategoryID } from "@/services/apiServices";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type CategoryListItemProps = {
  title: string;
  description: string;
  image: string;
  id: number;
};

export default function CategoryListItem({
  title,
  description,
  image,
  id,
}: CategoryListItemProps): JSX.Element {
  const { onUpdateCategory, isUpdatingCategory } = useEditCategories();
  const { onDeleteCategory, isDeletingCategory } = useDeleteCategory();
  const [openAlertDialog, setOpenAlertDialog] = useState<boolean>(false);
  const [openResponsiveDialog, setOpenResponsiveDialog] =
    useState<boolean>(false);
  const queryClient = useQueryClient();
  const placeholderImageLetter = title.split("").at(0)?.toUpperCase();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  function handleOnMouseEnter() {
    queryClient.prefetchQuery({
      queryKey: ["services", id],
      queryFn: () => getServicesByCategoryID(id),
    });
  }

  if (isDeletingCategory) return <Spinner />;

  return (
    <AccordionItem
      ref={setNodeRef}
      style={style}
      onMouseEnter={handleOnMouseEnter}
      value={title}
      className={`${openAlertDialog ? "bg-red-100" : ""} ${
        openResponsiveDialog ? "bg-teal-100" : ""
      } hover:bg-teal-50 relative data-[state=open]:bg-zinc-100 px-2 border-b last:border-b-0`}
    >
      <AccordionTrigger>
        {isUpdatingCategory ? (
          <ListItemSkeleton hasImage={true} />
        ) : (
          <div>
            <div
              {...attributes}
              {...listeners}
              className="absolute top-0 left-0 bottom-0 border-r flex justify-center items-center cursor-move touch-none"
            >
              <GripVertical strokeWidth={1} color="#71717a" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-12 w-12 min-h-12 min-w-12 ml-6 rounded overflow-hidden bg-zinc-200 flex justify-center items-center">
                {image ? (
                  <img src={image} alt={title} />
                ) : (
                  <span className="text-3xl text-zinc-50 no-underline">
                    {placeholderImageLetter}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-base">{title}</span>
              </div>
            </div>
          </div>
        )}
      </AccordionTrigger>

      <ResponsiveDialog
        className="absolute right-10 top-6 h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
        title={`Redigera "${title}"`}
        open={openResponsiveDialog}
        setOpen={setOpenResponsiveDialog}
      >
        <CategoryEditForm
          categoryToEdit={{ title, description, id }}
          onHandleCategory={onUpdateCategory}
        />
      </ResponsiveDialog>

      <DropdownMenuCustom className="absolute right-8 top-6">
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
        onClick={() => onDeleteCategory(id)}
        actionText="Radera"
      />
      <AccordionContent className="pb-0">
        <ServiceList id={id} />
      </AccordionContent>
    </AccordionItem>
  );
}
