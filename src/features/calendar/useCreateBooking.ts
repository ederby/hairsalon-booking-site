import { useToast } from "@/hooks/use-toast";
import { invalidateAllQueries } from "@/lib/helpers";
import { createBooking } from "@/services/apiCalendars";
import { useMutation } from "@tanstack/react-query";

export function useCreateBooking() {
  const { toast } = useToast();

  const { mutate: onCreateBooking, isPending: isCreatingBooking } = useMutation(
    {
      mutationFn: createBooking,
      onSuccess: () => {
        invalidateAllQueries("activebookings");
        toast({
          title: "Hurra!",
          description: "Bokningen har skapats",
          onSuccess: true,
        });
      },
      onError: () => {
        toast({
          title: "Attans!",
          description: "Bokningen kunde inte skapas",
          onSuccess: false,
        });
      },
    }
  );

  return { onCreateBooking, isCreatingBooking };
}
