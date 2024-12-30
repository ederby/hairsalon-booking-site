import { changeOrderServices } from "@/services/apiServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useChangeOrderServices() {
  const queryClient = useQueryClient();
  const { mutate: onChangeOrderServices, isPending: isChangeingOrderServices } =
    useMutation({
      mutationFn: changeOrderServices,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["services"] });
      },
    });

  return { onChangeOrderServices, isChangeingOrderServices };
}
