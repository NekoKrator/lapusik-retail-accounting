import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";

async function deleteExpense(id: string, shiftId: string) {
  const res = await axios.delete<ExpenseWithInclude>(
    `${API_ENDPOINTS.EXPENSE}/${id}?shiftId=${shiftId}`
  );
  return res.data;
}

export function useDeleteExpense(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExpense(id, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<ExpenseWithInclude[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous) => {
          if (!previous) {
            return [];
          }

          return previous.filter((p) => p.id !== response.id);
        }
      );
    },
  });
}
