import { useToast } from "@/hooks/use-toast";
import { createWorkday } from "@/services/apiGeneral";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateWorkday() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onCreateWorkday, isPending: isCreatingWorkday } = useMutation(
    {
      mutationFn: createWorkday,
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ["workdays"] });
        if (data) {
          toast({
            title: "Hurra!",
            description: "Arbetsdagarna har skapats",
            onSuccess: true,
          });
        }
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Arbetsdagarna kunde inte skapas",
          onSuccess: false,
        });
      },
    }
  );

  return { onCreateWorkday, isCreatingWorkday };
}
