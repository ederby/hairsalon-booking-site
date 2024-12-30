import { useToast } from "@/hooks/use-toast";
import { createService } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: onCreateService, isPending: isCreatingService } = useMutation(
    {
      mutationFn: createService,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast({
          title: "Hurra!",
          description: "Tjänsten har skapats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Tjänsten kunde inte skapas",
          onSuccess: false,
        });
      },
    }
  );

  return { onCreateService, isCreatingService };
}
