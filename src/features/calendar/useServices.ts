import { getServices } from "@/services/apiCalendars";
import { ServicesType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useServices() {
  const { data: services, isLoading: isLoadingServices } = useQuery<
    ServicesType[]
  >({
    queryKey: ["services"],
    queryFn: getServices,
  });

  return { services, isLoadingServices };
}
