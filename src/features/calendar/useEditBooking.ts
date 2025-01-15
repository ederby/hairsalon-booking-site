import { queryClient1 } from "@/App";
import { useToast } from "@/hooks/use-toast";
import { editBooking } from "@/services/apiCalendars";
import { useMutation } from "@tanstack/react-query";
import { queryClient2 } from "./Scheduler";

export function useEditBooking() {
  const { toast } = useToast();
  const { mutate: onEditBooking, isPending: isEditingBooking } = useMutation({
    mutationFn: editBooking,
    onSuccess: () => {
      const queryClients = [queryClient1, queryClient2];
      function invalidateAllQueries(queryKey: string) {
        queryClients.forEach((queryClient) => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
        });
      }
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
