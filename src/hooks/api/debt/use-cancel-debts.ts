import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type { DebtCancelResult } from "@/modules/debt/contracts";
import type { CancelSearchParams } from "@/modules/debt/search-params";
import type { DebtorListItem } from "@/modules/debtor/contracts";

function updateDebtorListAfterCancel(
  list: DebtorListItem[],
  debtorId: string,
  canceledDebtIds: Set<string>
): DebtorListItem[] {
  const result: DebtorListItem[] = [];

  for (const debtor of list) {
    if (debtor.id !== debtorId) {
      result.push(debtor);
      continue;
    }

    let hasActive = false;
    const debts: DebtorListItem["debts"] = [];

    for (const debt of debtor.debts) {
      if (canceledDebtIds.has(debt.id)) {
        continue;
      }

      if (debt.status === "ACTIVE") {
        hasActive = true;
      }

      debts.push(debt);
    }

    if (hasActive) {
      result.push({
        ...debtor,
        debts,
      });
    }
  }

  return result;
}

export function useCancelDebts(params: CancelSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      patchData<DebtCancelResult[]>(
        `${API_ENDPOINTS.DEBT}/cancel`,
        undefined,
        params
      ),

    onSuccess: (res) => {
      const canceledDebtIds = new Set(res.map((d) => d.id));

      queryClient.setQueryData<DebtorListItem[]>(
        [API_ENDPOINTS.DEBTOR],
        (prev = []) =>
          updateDebtorListAfterCancel(prev, params.debtorId, canceledDebtIds)
      );
    },
  });
}
