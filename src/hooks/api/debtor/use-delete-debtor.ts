import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";
import type { DebtorWithDebts } from "@/schemas/debtor-schema";

type DeleteDebtorSearchParams = {
  shiftId: string;
};

export function useDeleteDebtor(params: DeleteDebtorSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<DebtorWithDebts>(`${API_ENDPOINTS.DEBTOR}/${id}`, params),
    onSuccess: (response) => {
      queryClient.setQueryData<DebtorWithDebts[]>(
        [API_ENDPOINTS.DEBTOR],
        (previous = []) => previous.filter((p) => p.id !== response.id)
      );
    },
  });
}
