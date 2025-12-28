import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type {
  DebtorListItem,
  DebtorUpdateResult,
} from "@/modules/debtor/contracts";
import type { DebtorUpdateInput } from "@/schemas/debtor/debtor-schema";

const updateDebtorList = (
  list: DebtorListItem[],
  response: DebtorUpdateResult
): DebtorListItem[] => {
  const index = list.findIndex((item) => item.id === response.id);

  if (index === -1) {
    return list;
  }

  const currentItem = list[index];

  const updatedDebts = response.debts
    ? currentItem.debts.map((debt) => {
        const patch = response.debts?.find((d) => d.id === debt.id);
        if (!patch) {
          return debt;
        }

        return {
          ...debt,
          status: patch.status ?? debt.status,
          updatedAt: patch.updatedAt ?? debt.updatedAt,
        };
      })
    : currentItem.debts;

  if (response.debts && !updatedDebts.some((d) => d.status === "ACTIVE")) {
    return [...list.slice(0, index), ...list.slice(index + 1)];
  }

  const updatedItem: DebtorListItem = {
    ...currentItem,
    name: response.name ?? currentItem.name,
    updatedAt: response.updatedAt ?? currentItem.updatedAt,
    debts: updatedDebts,
  };

  const next = [...list];
  next[index] = updatedItem;

  return next;
};

export function useUpdateDebtor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DebtorUpdateInput }) =>
      patchData<DebtorUpdateResult>(`${API_ENDPOINTS.DEBTOR}/${id}`, payload),

    onSuccess: (res) => {
      queryClient.setQueryData<DebtorListItem[]>(
        [API_ENDPOINTS.DEBTOR],
        (prev = []) => updateDebtorList(prev, res)
      );
    },
  });
}
