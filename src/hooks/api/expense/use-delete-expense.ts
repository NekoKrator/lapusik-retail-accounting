import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";
import type {
  ExpenseDeleteResult,
  ExpenseListItem,
} from "@/modules/expense/contracts";

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<ExpenseDeleteResult>(`${API_ENDPOINTS.EXPENSE}/${id}`),
    onSuccess: (response) => {
      queryClient.setQueryData<ExpenseListItem[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous = []) => previous.filter((p) => p.id !== response.id)
      );
    },
  });
}
