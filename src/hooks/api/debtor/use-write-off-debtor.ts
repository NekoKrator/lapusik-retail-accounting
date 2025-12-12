import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdditionalIncome } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type {
  DebtorWithDebtsAndAdditionalIncome,
  DebtorWriteOffInput,
} from "@/schemas/debtor-schema";

type WriteOffDebtorSearchParams = {
  shiftId?: string;
};

export function useWriteOffDebtor(params?: WriteOffDebtorSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: DebtorWriteOffInput;
    }) =>
      postData<DebtorWithDebtsAndAdditionalIncome>(
        `${API_ENDPOINTS.DEBTOR}/${id}/write-off`,
        payload,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<DebtorWithDebtsAndAdditionalIncome[]>(
        [API_ENDPOINTS.DEBTOR],
        (previous = []) => {
          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.id
          );

          const hasActiveDebt = response.debts?.some(
            (d) => d.status === "ACTIVE"
          );

          return hasActiveDebt
            ? [response, ...listWithoutUpdatedItem]
            : listWithoutUpdatedItem;
        }
      );

      queryClient.setQueryData<AdditionalIncome[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME],
        (previous = []) => {
          const additionalIncome = response.additionalIncome.at(-1);

          if (additionalIncome === undefined) {
            return previous;
          }

          return [additionalIncome, ...previous];
        }
      );
    },
  });
}
