import { getExtraServices } from "@/services/apiServices";
import { ExtraservicesType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useExtraServices() {
  const { data: extraServices, isLoading: isLoadingExtraServices } = useQuery<
    ExtraservicesType[]
  >({
    queryKey: ["extraservices"],
    queryFn: getExtraServices,
  });

  return { extraServices, isLoadingExtraServices };
}
