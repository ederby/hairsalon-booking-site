import { useToast } from "@/hooks/use-toast";
import { cancelBooking } from "@/services/apiCalendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCancelBooking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onCancelBooking, isPending: isCancelingBooking } =
    useMutation({
      mutationFn: cancelBooking,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["activebookings"] });
        queryClient.invalidateQueries({ queryKey: ["allbookings"] });
        toast({
          title: "Hurra!",
          description: "Bokningen har avbokats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Bokningen kunde inte avbokas",
          onSuccess: false,
        });
      },
    });

  return { onCancelBooking, isCancelingBooking };
}
