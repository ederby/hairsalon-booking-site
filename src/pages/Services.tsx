import CategoryList from "@/components/ui/CategoryList";
import Spinner from "@/components/ui/Spinner";
import { getCategories } from "@/services/apiServices";
import { CategoryListType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export default function Services() {
  const { data: categories, isLoading } = useQuery<CategoryListType[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  console.log(categories);

  if (isLoading) return <Spinner />;

  return (
    <div>
      <CategoryList categories={categories ?? []} />
    </div>
  );
}
