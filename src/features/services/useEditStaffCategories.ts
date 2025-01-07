import { useToast } from "@/hooks/use-toast";
import { editStaffCategories } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditStaffCategories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: onEditStaffCategories, isPending: isEditingStaffCategories } =
    useMutation({
      mutationFn: editStaffCategories,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["staffByCategoryID"] });
        toast({
          title: "Hurra!",
          description: "Tjänsten har uppdaterats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Tjänsten kunde inte uppdaterats",
          onSuccess: false,
        });
      },
    });

  return { onEditStaffCategories, isEditingStaffCategories };
}
