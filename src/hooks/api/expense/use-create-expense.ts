import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { ExpenseListItem } from "@/modules/expense/contracts";
import type { CreateSearchParams } from "@/modules/expense/search-params";
import type { ExpenseCreateInput } from "@/schemas/expense/expense-schema";

export function useCreateExpense(params: CreateSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExpenseCreateInput) =>
      postData<ExpenseListItem>(API_ENDPOINTS.EXPENSE, payload, params),
    onSuccess: (response) => {
      queryClient.setQueryData<ExpenseListItem[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous = []) => [response, ...previous]
      );
    },
  });
}
