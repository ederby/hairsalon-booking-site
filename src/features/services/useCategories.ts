import { getCategories } from "@/services/apiGeneral";
import { CategoryListType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useCategories() {
  const { data: categories, isLoading: isLoadingCategories } = useQuery<
    CategoryListType[]
  >({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  return { categories, isLoadingCategories };
}
