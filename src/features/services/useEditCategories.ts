import { useToast } from "@/hooks/use-toast";
import { updateCategories } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditCategories() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onUpdateCategory, isPending: isUpdatingCategory } =
    useMutation({
      mutationFn: updateCategories,
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

  return { onUpdateCategory, isUpdatingCategory };
}
