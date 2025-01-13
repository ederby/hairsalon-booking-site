import { useToast } from "@/hooks/use-toast";
import { toggleExtraService } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleExtraService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: onToggleExtraService } = useMutation({
    mutationFn: toggleExtraService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extraservices"] });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Tjänsten kunde inte uppdaterats",
        onSuccess: false,
      });
    },
  });

  return { onToggleExtraService };
}
