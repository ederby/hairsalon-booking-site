import { useToast } from "@/hooks/use-toast";
import { editCategories } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onEditCategory, isPending: isEditingCategory } = useMutation({
    mutationFn: editCategories,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Hurra!",
        description: "Kategorin har uppdaterats",
        onSuccess: true,
      });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Kategorin kunde inte uppdaterats",
        onSuccess: false,
      });
    },
  });

  return { onEditCategory, isEditingCategory };
}
