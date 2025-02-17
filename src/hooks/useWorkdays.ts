import { getWorkdays } from "@/services/apiGeneral";
import { WorkdayType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useWorkdays() {
  const { data: workdays, isLoading: isLoadingWorkdays } = useQuery<
    WorkdayType[]
  >({
    queryKey: ["workdays"],
    queryFn: getWorkdays,
  });

  return { workdays, isLoadingWorkdays };
}
