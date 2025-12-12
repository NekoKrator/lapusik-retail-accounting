import { useQuery } from "@tanstack/react-query";
import type { Shift } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, getPaginatedData } from "@/lib/requests";

type ShiftSearchParams = {
  userId?: string;
  isClosed?: string;
  page?: number;
  limit?: number;
};

export function useShift(params?: ShiftSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SHIFT],
    queryFn: () => getData<Shift[]>(API_ENDPOINTS.SHIFT, params),
    staleTime: 60 * 60 * 1000,
  });
}

export function useShiftPaginated(params?: ShiftSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SHIFT, params],
    queryFn: () => getPaginatedData<Shift>(API_ENDPOINTS.SHIFT, params),
    staleTime: 60 * 60 * 1000,
  });
}
