import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, postData } from "@/lib/requests";
import type { ExpenseListItem } from "@/modules/expense/contracts";
import type { GetSearchParams } from "@/modules/expense/search-params";
import type { ExpenseStats } from "@/schemas/expense/expense-schema";
import type { ExpenseStatsInput } from "@/schemas/expense/expense-stats-payload";
import type { PaginatedResponse } from "@/types/types";

export function useExpenses(params?: GetSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.EXPENSE],
    queryFn: () => getData<ExpenseListItem[]>(API_ENDPOINTS.EXPENSE, params),
  });
}

export function useExpenseStats(payload?: ExpenseStatsInput) {
  return useQuery({
    queryKey: [API_ENDPOINTS.EXPENSE, payload],
    queryFn: () =>
      postData<PaginatedResponse<ExpenseStats>>(
        `${API_ENDPOINTS.EXPENSE}/stats`,
        payload
      ),
    staleTime: 60 * 60 * 1000,
  });
}
