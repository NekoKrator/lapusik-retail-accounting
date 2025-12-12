import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type {
  DebtorUpdateInput,
  DebtorWithDebts,
} from "@/schemas/debtor-schema";

type UpdateDebtorSearchParams = {
  shiftId?: string;
};

export function useUpdateDebtor(params?: UpdateDebtorSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DebtorUpdateInput }) =>
      patchData<DebtorWithDebts>(
        `${API_ENDPOINTS.DEBTOR}/${id}`,
        payload,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<DebtorWithDebts[]>(
        [API_ENDPOINTS.DEBTOR, params],
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
    },
  });
}
