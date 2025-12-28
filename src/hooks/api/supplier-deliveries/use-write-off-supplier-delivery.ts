import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type { ExpenseListItem } from "@/modules/expense/contracts";
import type {
  SupplierDeliveryListItem,
  SupplierDeliveryWriteOffResult,
} from "@/modules/supplier-delivery/contracts";
import type { WriteOffSearchParam } from "@/modules/supplier-delivery/search-params";
import type { SupplierDeliveryWriteOffInput } from "@/schemas/supplier-delivery/supplier-delivery-schema";

const updateSupplierDeliveryList = (
  list: SupplierDeliveryListItem[],
  response: SupplierDeliveryWriteOffResult
): SupplierDeliveryListItem[] => {
  const index = list.findIndex((item) => item.id === response.id);

  if (index === -1) {
    return list;
  }

  const currentItem = list[index];

  const updated: SupplierDeliveryListItem = {
    ...currentItem,
    paidByCashier: response.paidByCashier,
    paidByOwner: response.paidByOwner,
    status: response.status,
  };

  if (updated.status !== "ACTIVE") {
    return [...list.slice(0, index), ...list.slice(index + 1)];
  }

  const next = [...list];
  next[index] = updated;

  return next;
};

export function useWriteOffSupplierDelivery(params: WriteOffSearchParam) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SupplierDeliveryWriteOffInput;
    }) =>
      patchData<SupplierDeliveryWriteOffResult>(
        `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}/write-off`,
        payload,
        params
      ),

    onSuccess: (res) => {
      queryClient.setQueryData<SupplierDeliveryListItem[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (prev = []) => updateSupplierDeliveryList(prev, res)
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
