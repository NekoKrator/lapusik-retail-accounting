import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData } from "@/lib/requests";
import type { ShiftCurrent } from "@/types/types";

export function useShiftCurrent() {
  return useQuery({
    queryKey: [API_ENDPOINTS.SHIFT],
    queryFn: () => getData<ShiftCurrent>(`${API_ENDPOINTS.SHIFT}/current`),
  });
}
