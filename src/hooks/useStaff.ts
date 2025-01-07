import { getStaff } from "@/services/apiGeneral";
import { StaffType } from "@/services/types";
import { useQuery } from "@tanstack/react-query";

export function useStaff() {
  const { data: staff, isLoading: fetchingStaff } = useQuery<StaffType[]>({
    queryKey: ["staff"],
    queryFn: getStaff,
  });

  return { staff, fetchingStaff };
}
