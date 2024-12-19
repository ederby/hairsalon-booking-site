import { CategoryListType } from "@/services/types";
import { Accordion } from "../../components/ui/accordion";
import ContentHeader from "../../components/layout/ContentHeader";
import CategoryListItem from "./CategoryListItem";
import { Button } from "@/components/ui/button";
import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import EditCategoryForm from "./EditCategoryForm";
import { useCreateCategory } from "./useCreateCategory";
import Spinner from "@/components/layout/Spinner";

type CategoryListProps = {
  categories: CategoryListType[];
};

export default function CategoryList({
  categories,
}: CategoryListProps): JSX.Element {
  const { onCreateCategory, isCreatingCategory } = useCreateCategory();
  return (
    <div>
      <ContentHeader>
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Kategorier
        </h1>
        <ResponsiveDialog
          title="Skapa en ny kategori"
          trigger={<Button variant="outline">Lägg till kategori</Button>}
        >
          <EditCategoryForm onHandleCategory={onCreateCategory} />
        </ResponsiveDialog>
      </ContentHeader>

      {isCreatingCategory ? (
        <Spinner />
      ) : (
        <Accordion type="single" collapsible>
          {categories.map((category) => (
            <CategoryListItem
              key={category.id}
              id={category.id}
              title={category.title}
              description={category.description}
              image={category.image}
            />
          ))}
        </Accordion>
      )}
    </div>
  );
}
