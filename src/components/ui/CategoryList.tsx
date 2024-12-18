import { CategoryListType } from "@/services/types";
import CategoryListItem from "./CategoryListItem";
import { Accordion } from "./accordion";
import ContentHeader from "./ContentHeader";

type CategoryListProps = {
  categories: CategoryListType[];
};

export default function CategoryList({
  categories,
}: CategoryListProps): JSX.Element {
  return (
    <div>
      <ContentHeader>
        <h1 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Kategorier
        </h1>
      </ContentHeader>

      <Accordion type="single" collapsible>
        {categories.map((category) => (
          <CategoryListItem
            key={category.id}
            title={category.title}
            description={category.description}
            image={category.image}
          />
        ))}
      </Accordion>
    </div>
  );
}
