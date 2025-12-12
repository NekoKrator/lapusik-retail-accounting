import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type {
  ExpenseCreateInput,
  ExpenseWithInclude,
} from "@/schemas/expense-schema";

type CreateExpenseSearchParams = {
  shiftId: string;
};

export function useCreateExpense(params: CreateExpenseSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExpenseCreateInput) =>
      postData<ExpenseWithInclude>(API_ENDPOINTS.EXPENSE, payload, params),
    onSuccess: (response) => {
      queryClient.setQueryData<ExpenseWithInclude[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous = []) => [response, ...previous]
      );
    },
  });
}
