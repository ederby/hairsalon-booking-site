import { useToast } from "@/hooks/use-toast";
import { toggleService } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: onToggleService } = useMutation({
    mutationFn: toggleService,
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

  return { onToggleService };
}
