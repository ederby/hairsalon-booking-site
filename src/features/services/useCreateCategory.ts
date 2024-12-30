import { useToast } from "@/hooks/use-toast";
import { createCategory } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCategory() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onCreateCategory, isPending: isCreatingCategory } =
    useMutation({
      mutationFn: createCategory,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        toast({
          title: "Hurra!",
          description: "Kategorin har skapats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Kategorin kunde inte skapas",
          onSuccess: false,
        });
      },
    });

  return { onCreateCategory, isCreatingCategory };
}
