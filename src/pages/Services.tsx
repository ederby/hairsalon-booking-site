import CategoryList from "@/features/services/CategoryList";
import Spinner from "@/components/layout/Spinner";
import Wrapper from "@/components/layout/Wrapper";
import { useCategories } from "@/features/services/useCategories";

export default function Services() {
  const { categories, isLoading } = useCategories();

  if (isLoading) return <Spinner />;

  return (
    <Wrapper>
      <CategoryList categories={categories ?? []} />
    </Wrapper>
  );
}
