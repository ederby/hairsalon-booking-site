import { getCategories } from "@/services/apiServices";
import { CategoryListType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const { data: categories, isLoading } = useQuery<CategoryListType[]>({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return { categories, isLoading };
}
