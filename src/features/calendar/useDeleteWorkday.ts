import { useToast } from "@/hooks/use-toast";
import { deleteWorkdayByDate } from "@/services/apiCalendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteWorkday() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onDeleteWorkday, isPending: isDeletingWorkday } = useMutation(
    {
      mutationFn: deleteWorkdayByDate,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["workdays"] });
        toast({
          title: "Hurra!",
          description: "Arbetsdagen har tagits bort",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Arbetsdagen kunde inte tas bort",
          onSuccess: false,
        });
      },
    }
  );

  return { onDeleteWorkday, isDeletingWorkday };
}
