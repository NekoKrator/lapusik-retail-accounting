import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";

type DeleteExpenseSearchParams = {
  shiftId: string;
};

export function useDeleteExpense(params: DeleteExpenseSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<ExpenseWithInclude>(`${API_ENDPOINTS.EXPENSE}/${id}`, params),
    onSuccess: (response) => {
      queryClient.setQueryData<ExpenseWithInclude[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous = []) => previous.filter((p) => p.id !== response.id)
      );
    },
  });
}
