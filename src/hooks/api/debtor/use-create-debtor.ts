import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type {
  DebtorCreateInput,
  DebtorWithExpenses,
} from "@/schemas/debtor-schema";

async function postDebtor(payload: DebtorCreateInput, shiftId: string) {
  const res = await axios.post<DebtorWithExpenses>(
    `${API_ENDPOINTS.DEBTOR}?shiftId=${shiftId}`,
    payload
  );

  return {
    data: res.data,
    status: res.status,
  };
}

export function useCreateDebtor(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DebtorCreateInput) => postDebtor(payload, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<DebtorWithExpenses[]>(
        [API_ENDPOINTS.DEBTOR],
        (previous) => {
          if (!previous) {
            return [response.data];
          }

          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.data.id
          );

          return [response.data, ...listWithoutUpdatedItem];
        }
      );

      queryClient.setQueryData<Expense[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous) => {
          const expense = response.data.expenses.at(-1);

          if (expense === undefined) {
            return previous || [];
          }

          if (!previous) {
            return [expense];
          }

          return [expense, ...previous];
        }
      );
    },
  });
}
