import { changeOrderCategories } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useChangeOrderCategories() {
  const queryClient = useQueryClient();
  const {
    mutate: onChangeOrderCategories,
    isPending: isChangingOrderCategories,
  } = useMutation({
    mutationFn: changeOrderCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return { onChangeOrderCategories, isChangingOrderCategories };
}
