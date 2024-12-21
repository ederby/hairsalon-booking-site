import { useToast } from "@/hooks/use-toast";
import { editService } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: onEditService, isPending: isEditingService } = useMutation({
    mutationFn: editService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
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

  return { onEditService, isEditingService };
}
