import { useToast } from "@/hooks/use-toast";
import { deleteCategory } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCategory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onDeleteCategory, isPending: isDeletingCategory } =
    useMutation({
      mutationFn: deleteCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast({
          title: "Hurra!",
          description: "Kategorin har raderats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Kategorin kunde inte raderas",
          onSuccess: false,
        });
      },
    });

  return { onDeleteCategory, isDeletingCategory };
}
