import { useToast } from "@/hooks/use-toast";
import { createBooking } from "@/services/apiCalendars";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateBooking() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: onCreateBooking, isPending: isCreatingBooking } = useMutation(
    {
      mutationFn: createBooking,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["activebookings"] });
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
