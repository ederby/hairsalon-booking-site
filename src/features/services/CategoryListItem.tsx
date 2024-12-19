import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CircleX, Pencil } from "lucide-react";
import CategoryListItemSkeleton from "./CategoryListItemSkeleton";
import EditCategoryForm from "./EditCategoryForm";
import { useEditCategories } from "./useEditCategories";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteCategory } from "./useDeleteCategory";
import Spinner from "@/components/layout/Spinner";

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

  if (isDeletingCategory) return <Spinner />;

  return (
    <AccordionItem value={title} className="hover:bg-teal-50 px-2 relative">
      <AccordionTrigger>
        {isUpdatingCategory ? (
          <CategoryListItemSkeleton />
        ) : (
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 min-h-12 min-w-12 rounded overflow-hidden">
              <img src={image} alt={title} />
            </div>
            <div className="flex flex-col">
              <span className="text-base">{title}</span>
            </div>
          </div>
        )}
      </AccordionTrigger>

      <ResponsiveDialog
        className="absolute right-10 top-6 h-8 w-8 rounded bg-zinc-100 text-zinc-500 hover:bg-teal-600 hover:text-teal-50 px-[10px]"
        title={`Redigera ${title}`}
        trigger={<Pencil size={14} />}
      >
        <EditCategoryForm
          categoryToEdit={{ title, description, id }}
          onHandleCategory={onUpdateCategory}
        />
      </ResponsiveDialog>

      <AlertDialog>
        <AlertDialogTrigger className="absolute right-20 top-6 px-[10px] h-8 w-8">
          <CircleX color="#a1a1aa" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Är du helt säker?</AlertDialogTitle>
            <AlertDialogDescription>
              Du håller på att radera denna kategori. Om du raderar denna
              kategori så försvinner också alla tjänster som är koppplade till
              den.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tillbaka</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDeleteCategory(id)}
              className="bg-red-600 hover:bg-red-500"
            >
              Radera
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AccordionContent>{title}</AccordionContent>
    </AccordionItem>
  );
}
