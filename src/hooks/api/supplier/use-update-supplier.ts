import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type {
  SupplierListItem,
  SupplierUpdateResult,
} from "@/modules/supplier/contracts";
import type { SupplierUpdateInput } from "@/schemas/supplier/supplier-schema";

const updateSupplierList = (
  list: SupplierListItem[],
  response: SupplierUpdateResult
): SupplierListItem[] => {
  const index = list.findIndex((item) => item.id === response.id);

  if (index === -1) {
    return list;
  }

  const currentItem = list[index];

  const updated: SupplierListItem = {
    ...currentItem,
  };

  const next = [...list];
  next[index] = updated;

  return next;
};

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SupplierUpdateInput;
    }) =>
      patchData<SupplierUpdateResult>(
        `${API_ENDPOINTS.SUPPLIER}/${id}`,
        payload
      ),
    onSuccess: (res) => {
      queryClient.setQueryData<SupplierListItem[]>(
        [API_ENDPOINTS.SUPPLIER],
        (prev = []) => updateSupplierList(prev, res)
      );
    },
  });
}
