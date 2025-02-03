import { useToast } from "@/hooks/use-toast";
import { editBreak } from "@/services/apiCalendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditBreak() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onEditBreak, isPending: isEditingBreak } = useMutation({
    mutationFn: editBreak,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Hurra!",
        description: "Frånvaron har uppdaterats",
        onSuccess: true,
      });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Frånvaron kunde inte uppdaterats",
        onSuccess: false,
      });
    },
  });

  return { onEditBreak, isEditingBreak };
}
