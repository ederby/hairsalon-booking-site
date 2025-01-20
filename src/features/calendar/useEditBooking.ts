import { useToast } from "@/hooks/use-toast";
import { invalidateAllQueries } from "@/lib/helpers";
import { editBooking } from "@/services/apiCalendars";
import { useMutation } from "@tanstack/react-query";

export function useEditBooking() {
  const { toast } = useToast();
  const { mutate: onEditBooking, isPending: isEditingBooking } = useMutation({
    mutationFn: editBooking,
    onSuccess: () => {
      invalidateAllQueries("activebookings");

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
