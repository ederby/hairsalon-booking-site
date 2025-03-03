import { useToast } from "@/hooks/use-toast";
import { editGeneralSettings } from "@/services/apiSettings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditGeneralSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onEditGeneralSettings, isPending: isEditingGeneralSettings } =
    useMutation({
      mutationFn: editGeneralSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["generalsettings"] });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Inställningarna kunde inte uppdaterats",
          onSuccess: false,
        });
      },
    });

  return { onEditGeneralSettings, isEditingGeneralSettings };
}
