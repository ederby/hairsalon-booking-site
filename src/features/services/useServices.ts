import { getServicesByCategoryID } from "@/services/apiServices";
import { useQuery } from "@tanstack/react-query";

export function useServices(id: number) {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services", id],
    queryFn: () => getServicesByCategoryID(id),
  });

  return { services, isLoading };
}
