import { useToast } from "@/hooks/use-toast";
import { toggleActiveStaff } from "@/services/apiStaff";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToggleActiveStaff() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: onToggleActiveStaff } = useMutation({
    mutationFn: toggleActiveStaff,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Aktiviteten kunde inte uppdaterats",
        onSuccess: false,
      });
    },
  });

  return { onToggleActiveStaff };
}
