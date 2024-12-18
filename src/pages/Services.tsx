import CategoryList from "@/components/ui/CategoryList";
import Spinner from "@/components/ui/Spinner";
import Wrapper from "@/components/ui/Wrapper";
import { getCategories } from "@/services/apiServices";
import { CategoryListType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export default function Services() {
  const { data: categories, isLoading } = useQuery<CategoryListType[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  if (isLoading) return <Spinner />;

  return (
    <Wrapper>
      <CategoryList categories={categories ?? []} />
    </Wrapper>
  );
}
