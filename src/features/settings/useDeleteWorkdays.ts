import { useToast } from "@/hooks/use-toast";
import { deleteWorkdays } from "@/services/apiSettings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteWorkdays() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onDeleteWorkdays, isPending: isDeletingWorkdays } =
    useMutation({
      mutationFn: deleteWorkdays,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["workdays"] });
        toast({
          title: "Hurra!",
          description: "Arbetsdagarna har raderats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Arbetsdagarna kunde inte raderas",
          onSuccess: false,
        });
      },
    });

  return { onDeleteWorkdays, isDeletingWorkdays };
}
