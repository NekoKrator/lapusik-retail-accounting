import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type {
  DebtorCreateInput,
  DebtorWithDebtsAndExpenses,
} from "@/schemas/debtor-schema";

type CreateDebtorSearchParams = {
  shiftId: string;
};

export function useCreateDebtor(params: CreateDebtorSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DebtorCreateInput) =>
      postData<DebtorWithDebtsAndExpenses>(
        API_ENDPOINTS.DEBTOR,
        payload,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<DebtorWithDebtsAndExpenses[]>(
        [API_ENDPOINTS.DEBTOR],
        (previous = []) => {
          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.id
          );

          return [response, ...listWithoutUpdatedItem];
        }
      );

      queryClient.setQueryData<Expense[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous) => {
          const expense = response.expenses.at(-1);

          if (expense === undefined) {
            return [];
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
