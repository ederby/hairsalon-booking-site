import { useToast } from "@/hooks/use-toast";
import { createWorkday } from "@/services/apiCalendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateWorkday() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onCreateWorkday, isPending: isCreatingWorkday } = useMutation(
    {
      mutationFn: createWorkday,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["workdays"] });
        toast({
          title: "Hurra!",
          description: "Arbetsdagen har skapats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Arbetsdagen kunde inte skapas",
          onSuccess: false,
        });
      },
    }
  );

  return { onCreateWorkday, isCreatingWorkday };
}
