import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, getPaginatedData } from "@/lib/requests";
import type { DebtorWithDebts } from "@/schemas/debtor-schema";

type DebtorSearchParams = {
  userId?: string;
  status?: string;
  page?: number;
  limit?: number;
};

export function useDebtors(params?: DebtorSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.DEBTOR],
    queryFn: () => getData<DebtorWithDebts[]>(API_ENDPOINTS.DEBTOR, params),
    staleTime: 60 * 60 * 1000,
  });
}

export function useDebtorsPaginated(params?: DebtorSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.DEBTOR, params],
    queryFn: () =>
      getPaginatedData<DebtorWithDebts>(API_ENDPOINTS.DEBTOR, params),
    staleTime: 60 * 60 * 1000,
  });
}
