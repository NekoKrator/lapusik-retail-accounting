import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, getPaginatedData } from "@/lib/requests";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";

type ExpensesSearchParams = {
  shiftId?: string;
  page?: number;
  limit?: number;
};

export function useExpenses(params?: ExpensesSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.EXPENSE],
    queryFn: () => getData<ExpenseWithInclude[]>(API_ENDPOINTS.EXPENSE, params),
    staleTime: 60 * 60 * 1000,
  });
}

export function useExpensesPaginated(params?: ExpensesSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.EXPENSE, params],
    queryFn: () =>
      getPaginatedData<ExpenseWithInclude>(API_ENDPOINTS.EXPENSE, params),
    staleTime: 60 * 60 * 1000,
  });
}
