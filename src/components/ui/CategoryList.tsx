import { CategoryListType } from "@/services/types";

type CategoryListProps = {
  categories: CategoryListType[];
};

export default function CategoryList({
  categories,
}: CategoryListProps): JSX.Element {
  console.log(categories);
  return <div>Category</div>;
}
