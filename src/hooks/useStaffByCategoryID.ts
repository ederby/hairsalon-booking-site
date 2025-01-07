import { getStaffIDByCategoryID } from "@/services/apiServices";
import { useQuery } from "@tanstack/react-query";

export function useStaffByCategoryID(id: number) {
  const { data: staffByCategoryID, isLoading: fetchingStaffByCategoryID } =
    useQuery<number[]>({
      queryKey: ["staffByCategoryID", id],
      queryFn: () => getStaffIDByCategoryID(id),
    });

  return { staffByCategoryID, fetchingStaffByCategoryID };
}
