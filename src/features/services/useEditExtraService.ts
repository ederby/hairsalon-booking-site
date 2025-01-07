import { useToast } from "@/hooks/use-toast";
import { editExtraService } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditExtraService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: onEditExtraService, isPending: isEditingExtraService } =
    useMutation({
      mutationFn: editExtraService,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["extraservices"] });
        toast({
          title: "Hurra!",
          description: "Tilläggstjänsten har uppdaterats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Tilläggstjänsten kunde inte uppdaterats",
          onSuccess: false,
        });
      },
    });

  return { onEditExtraService, isEditingExtraService };
}
