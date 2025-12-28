import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { ShiftStats } from "@/schemas/shift/shift-schema";
import type { ShiftStatsInput } from "@/schemas/shift/shift-stats-search-payload";
import type { PaginatedResponse } from "@/types/types";

export function useShiftsStats(payload?: ShiftStatsInput) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SHIFT, payload],
    queryFn: () =>
      postData<PaginatedResponse<ShiftStats>>(
        `${API_ENDPOINTS.SHIFT}/stats`,
        payload
      ),
    staleTime: 60 * 60 * 1000,
  });
}
