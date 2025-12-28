import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type {
  SupplierDeliveryListItem,
  SupplierDeliveryUpdateResult,
} from "@/modules/supplier-delivery/contracts";
import type { SupplierDeliveryUpdateInput } from "@/schemas/supplier-delivery/supplier-delivery-schema";

const updateSupplierDeliveryList = (
  list: SupplierDeliveryListItem[],
  response: SupplierDeliveryUpdateResult
): SupplierDeliveryListItem[] => {
  const index = list.findIndex((item) => item.id === response.id);

  if (index === -1) {
    return list;
  }

  const currentItem = list[index];

  const updated: SupplierDeliveryListItem = {
    ...currentItem,
    status: response.status ?? currentItem.status,
    paidByCashier: response.paidByCashier ?? currentItem.paidByCashier,
    paidByOwner: response.paidByOwner ?? currentItem.paidByOwner,
    updatedAt: response.updatedAt ?? currentItem.updatedAt,
  };

  if (updated.status !== "ACTIVE") {
    return [...list.slice(0, index), ...list.slice(index + 1)];
  }

  const next = [...list];
  next[index] = updated;

  return next;
};

export function useUpdateSupplierDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SupplierDeliveryUpdateInput;
    }) =>
      patchData<SupplierDeliveryUpdateResult>(
        `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}`,
        payload
      ),
    onSuccess: (res) => {
      queryClient.setQueryData<SupplierDeliveryListItem[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (prev = []) => updateSupplierDeliveryList(prev, res)
      );
    },
  });
}
