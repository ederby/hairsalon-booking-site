import { useToast } from "@/hooks/use-toast";
import { editStaff } from "@/services/apiSettings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditStaff() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onEditStaff, isPending: isEditingStaff } = useMutation({
    mutationFn: editStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast({
        title: "Hurra!",
        description: "Informationen har uppdaterats",
        onSuccess: true,
      });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Informationen kunde inte uppdaterats",
        onSuccess: false,
      });
    },
  });

  return { onEditStaff, isEditingStaff };
}
