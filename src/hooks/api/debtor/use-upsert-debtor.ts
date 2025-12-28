import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type {
  DebtorListItem,
  DebtorUpsertResult,
} from "@/modules/debtor/contracts";
import type { UpsertSearchParams } from "@/modules/debtor/search-params";
import type { ExpenseListItem } from "@/modules/expense/contracts";
import type { DebtorCreateInput } from "@/schemas/debtor/debtor-schema";

export function useUpsertDebtor(params: UpsertSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DebtorCreateInput) =>
      postData<DebtorUpsertResult>(API_ENDPOINTS.DEBTOR, payload, params),
    onSuccess: (res) => {
      queryClient.setQueryData<DebtorListItem[]>(
        [API_ENDPOINTS.DEBTOR],
        (prev = []) => [res, ...prev.filter(({ id }) => id !== res.id)] // wrong type insert
      );

      queryClient.setQueryData<ExpenseListItem[]>(
        [API_ENDPOINTS.EXPENSE],
        (prev = []) => {
          const { expense } = res;
          if (!expense) {
            return prev;
          }

          return [expense, ...prev.filter(({ id }) => id !== expense.id)];
        }
      );
    },
  });
}
