import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { AdditionalIncomeListItem } from "@/modules/additional-income/contracts";
import type {
  DebtorListItem,
  DebtorWriteOffResult,
} from "@/modules/debtor/contracts";
import type { WriteOffSearchParams } from "@/modules/debtor/search-params";
import type { DebtorWriteOffInput } from "@/schemas/debtor/debtor-schema";

const updateDebtorList = (
  list: DebtorListItem[],
  response: DebtorWriteOffResult
): DebtorListItem[] => {
  const index = list.findIndex((item) => item.id === response.id);

  if (index === -1) {
    return list;
  }

  const currentItem = list[index];

  const updatedDebts = currentItem.debts.map((debt) => {
    const updatedDebt = response.debts.find((d) => d.id === debt.id);

    if (!updatedDebt) {
      return debt;
    }

    return {
      ...debt,
      paidAmount: updatedDebt.paidAmount,
      status: updatedDebt.status,
      updatedAt: updatedDebt.updatedAt,
    };
  });

  if (!updatedDebts.some((d) => d.status === "ACTIVE")) {
    return [...list.slice(0, index), ...list.slice(index + 1)];
  }

  const next = [...list];
  next[index] = {
    ...currentItem,
    debts: updatedDebts,
  };

  return next;
};

export function useWriteOffDebtor(params?: WriteOffSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: DebtorWriteOffInput;
    }) =>
      postData<DebtorWriteOffResult>(
        `${API_ENDPOINTS.DEBTOR}/${id}/write-off`,
        payload,
        params
      ),
    onSuccess: (res) => {
      queryClient.setQueryData<DebtorListItem[]>(
        [API_ENDPOINTS.DEBTOR],
        (prev = []) => updateDebtorList(prev, res)
      );

      queryClient.setQueryData<AdditionalIncomeListItem[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME],
        (prev = []) => {
          const { additionalIncome } = res;
          if (!additionalIncome) {
            return prev;
          }

          return [
            additionalIncome,
            ...prev.filter(({ id }) => id !== additionalIncome.id),
          ];
        }
      );
    },
  });
}
