import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";
import type {
  DebtorDeleteResult,
  DebtorListItem,
} from "@/modules/debtor/contracts";

export function useDeleteDebtor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<DebtorDeleteResult>(`${API_ENDPOINTS.DEBTOR}/${id}`),
    onSuccess: (res) => {
      queryClient.setQueryData<DebtorListItem[]>(
        [API_ENDPOINTS.DEBTOR],
        (prev = []) => prev.filter((i) => i.id !== res.id)
      );
    },
  });
}
