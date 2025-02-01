import { useToast } from "@/hooks/use-toast";
import { createBreak } from "@/services/apiCalendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBreak() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onCreateBreak, isPending: isCreatingBreak } = useMutation({
    mutationFn: createBreak,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activebookings"] });
      queryClient.invalidateQueries({ queryKey: ["allbookings"] });
      toast({
        title: "Hurra!",
        description: "Frånvaron har skapats",
        onSuccess: true,
      });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Frånvaron kunde inte skapas",
        onSuccess: false,
      });
    },
  });

  return { onCreateBreak, isCreatingBreak };
}
