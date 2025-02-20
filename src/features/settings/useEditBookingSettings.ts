import { useToast } from "@/hooks/use-toast";
import { editBookingSettings } from "@/services/apiSettings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditBookingSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onEditBookingSettings, isPending: isEditingBookingSettings } =
    useMutation({
      mutationFn: editBookingSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["bookingsettings"] });
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

  return { onEditBookingSettings, isEditingBookingSettings };
}
