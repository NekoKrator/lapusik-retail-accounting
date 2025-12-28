import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, postData } from "@/lib/requests";
import type { AdditionalIncomeListItem } from "@/modules/additional-income/contracts";
import type { GetSearchParams } from "@/modules/additional-income/search-params";
import type { AdditionalIncomeStats } from "@/schemas/additional-income/additional-income-schema";
import type { AdditionalIncomeStatsInput } from "@/schemas/additional-income/additional-income-stats-payload";
import type { PaginatedResponse } from "@/types/types";

export function useAdditionalIncome(params?: GetSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.ADDITIONAL_INCOME],
    queryFn: () =>
      getData<AdditionalIncomeListItem[]>(
        API_ENDPOINTS.ADDITIONAL_INCOME,
        params
      ),
  });
}

export function useAdditionalIncomeStats(payload?: AdditionalIncomeStatsInput) {
  return useQuery({
    queryKey: [API_ENDPOINTS.ADDITIONAL_INCOME, payload],
    queryFn: () =>
      postData<PaginatedResponse<AdditionalIncomeStats>>(
        `${API_ENDPOINTS.ADDITIONAL_INCOME}/stats`,
        payload
      ),
    staleTime: 60 * 60 * 1000,
  });
}
