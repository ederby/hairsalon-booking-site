import { useToast } from "@/hooks/use-toast";
import { editBooking } from "@/services/apiCalendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useEditBooking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onEditBooking, isPending: isEditingBooking } = useMutation({
    mutationFn: editBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast({
        title: "Hurra!",
        description: "Bokningen har uppdaterats",
        onSuccess: true,
      });
    },
    onError: () => {
      toast({
        title: "Attans!",
        description: "Bokningen kunde inte uppdaterats",
        onSuccess: false,
      });
    },
  });

  return { onEditBooking, isEditingBooking };
}
