import { useToast } from "@/hooks/use-toast";
import { editCompanySettings } from "@/services/apiSettings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditCompanySettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onEditCompanySettings, isPending: isEditingCompanySettings } =
    useMutation({
      mutationFn: editCompanySettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["companysettings"] });
        toast({
          title: "Hurra!",
          description: "Inställningarna har uppdaterats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Inställningarna kunde inte uppdaterats",
          onSuccess: false,
        });
      },
    });

  return { onEditCompanySettings, isEditingCompanySettings };
}
