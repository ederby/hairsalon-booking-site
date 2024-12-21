import ResponsiveDialog from "@/components/layout/ResponsiveDialog";
import Spinner from "@/components/layout/Spinner";
import { Button } from "@/components/ui/button";
import { CategoryListType } from "@/services/types";
import ContentHeader from "../../components/layout/ContentHeader";
import { Accordion } from "../../components/ui/accordion";
import CategoryEditForm from "./CategoryEditForm";
import CategoryListItem from "./CategoryListItem";
import { useCreateCategory } from "./useCreateCategory";

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
          <CategoryEditForm onHandleCategory={onCreateCategory} />
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
