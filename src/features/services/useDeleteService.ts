import { useToast } from "@/hooks/use-toast";
import { deleteService } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteService() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate: onDeleteService, isPending: isDeletingService } = useMutation(
    {
      mutationFn: deleteService,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["services"] });
        toast({
          title: "Hurra!",
          description: "Tjänsten har raderats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Tjänsten kunde inte raderas",
          onSuccess: false,
        });
      },
    }
  );

  return { onDeleteService, isDeletingService };
}
