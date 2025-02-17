import { useToast } from "@/hooks/use-toast";
import { deleteWorkday } from "@/services/apiStaff";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteWorkdayByDate() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onDeleteWorkdayByDate, isPending: isDeletingWorkday } =
    useMutation({
      mutationFn: deleteWorkday,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["workdays"] });
        toast({
          title: "Hurra!",
          description: "Arbetsdagen har raderats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Arbetsdagen kunde inte raderas",
          onSuccess: false,
        });
      },
    });

  return { onDeleteWorkdayByDate, isDeletingWorkday };
}
