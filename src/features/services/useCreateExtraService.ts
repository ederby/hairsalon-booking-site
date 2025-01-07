import { useToast } from "@/hooks/use-toast";
import { createExtraService } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateExtraService() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onCreateExtraService, isPending: isCreatingExtraService } =
    useMutation({
      mutationFn: createExtraService,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["extraservices"] });
        toast({
          title: "Hurra!",
          description: "Tilläggstjänsten har skapats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Tilläggstjänsten kunde inte skapas",
          onSuccess: false,
        });
      },
    });

  return { onCreateExtraService, isCreatingExtraService };
}
