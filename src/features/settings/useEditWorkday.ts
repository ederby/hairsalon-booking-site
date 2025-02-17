import { useToast } from "@/hooks/use-toast";
import { editWorkday } from "@/services/apiStaff";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditWorkday() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onEditWorkday, isPending: isEditingWorkday } = useMutation({
    mutationFn: editWorkday,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workdays"] });
      toast({
        title: "Hurra!",
        description: "Arbetsdagen har uppdaterats",
        onSuccess: true,
      });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Arbetsdagen kunde inte uppdaterats",
        onSuccess: false,
      });
    },
  });

  return { onEditWorkday, isEditingWorkday };
}
