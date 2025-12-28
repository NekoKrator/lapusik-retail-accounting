import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, postData } from "@/lib/requests";
import type { DebtorListItem } from "@/modules/debtor/contracts";
import type { GetSearchParams } from "@/modules/debtor/search-params";
import type { DebtorStats } from "@/schemas/debtor/debtor-schema";
import type { DebtorStatsInput } from "@/schemas/debtor/debtor-stats-search-payload";
import type { PaginatedResponse } from "@/types/types";

export function useDebtors(params?: GetSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.DEBTOR],
    queryFn: () => getData<DebtorListItem[]>(API_ENDPOINTS.DEBTOR, params),
  });
}

export function useDebtorsStats(payload?: DebtorStatsInput) {
  return useQuery({
    queryKey: [API_ENDPOINTS.DEBTOR, payload],
    queryFn: () =>
      postData<PaginatedResponse<DebtorStats>>(
        `${API_ENDPOINTS.DEBTOR}/stats`,
        payload
      ),
    staleTime: 60 * 60 * 1000,
  });
}
