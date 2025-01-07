import { useToast } from "@/hooks/use-toast";
import { deleteExtraService } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteExtraService() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onDeleteExtraService, isPending: isDeletingExtraService } =
    useMutation({
      mutationFn: deleteExtraService,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["extraservices"] });
        toast({
          title: "Hurra!",
          description: "Tilläggstjänsten har raderats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Tilläggstjänsten kunde inte raderas",
          onSuccess: false,
        });
      },
    });

  return { onDeleteExtraService, isDeletingExtraService };
}
