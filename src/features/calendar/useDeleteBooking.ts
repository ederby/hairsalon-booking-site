import { useToast } from "@/hooks/use-toast";
import { deleteBooking } from "@/services/apiCalendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteBooking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: onDeleteBooking, isPending: isDeletingBooking } = useMutation(
    {
      mutationFn: deleteBooking,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["activebookings"] });
        queryClient.invalidateQueries({ queryKey: ["bookings"] });
        toast({
          title: "Hurra!",
          description: "Bokning har raderats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Bokning kunde inte raderas",
          onSuccess: false,
        });
      },
    }
  );

  return { onDeleteBooking, isDeletingBooking };
}
