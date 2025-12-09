import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { DebtorWithExpenses } from "@/schemas/debtor-schema";

async function deleteDebtor(id: string, shiftId: string) {
  const res = await axios.delete<DebtorWithExpenses>(
    `${API_ENDPOINTS.DEBTOR}/${id}?shiftId=${shiftId}`
  );
  return res.data;
}

export function useDeleteDebtor(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteDebtor(id, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<DebtorWithExpenses[]>(
        [API_ENDPOINTS.DEBTOR],
        (previous) => {
          if (!previous) {
            return [];
          }

          return previous.filter((d) => d.id !== response.id);
        }
      );

      queryClient.setQueryData<Expense[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous) => {
          if (!previous) {
            return [];
          }

          if (response.isPaidOff) {
            return previous;
          }

          const expenseIdsToDelete = response.expenses.map(
            (expense) => expense.id
          );

          return previous.filter(
            (previousExpense) =>
              !expenseIdsToDelete.includes(previousExpense.id)
          );
        }
      );
    },
  });
}
