import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type {
  SupplierDeliveryWithSupplierAndExpenses,
  SupplierDeliveryWriteOffInput,
} from "@/schemas/supplier-delivery-schema";

type WriteOffSupplierDeliverySearchParams = {
  shiftId: string;
};

export function useWriteOffSupplierDelivery(
  params: WriteOffSupplierDeliverySearchParams
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SupplierDeliveryWriteOffInput;
    }) =>
      patchData<SupplierDeliveryWithSupplierAndExpenses>(
        `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}/write-off`,
        payload,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplierAndExpenses[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (previous = []) => {
          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.id
          );

          if (response.isPaidOff) {
            return listWithoutUpdatedItem;
          }

          return [response, ...listWithoutUpdatedItem];
        }
      );

      queryClient.setQueryData<Expense[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous = []) => {
          const expense = response.expenses.at(-1);

          if (expense === undefined) {
            return previous;
          }

          return [expense, ...previous];
        }
      );
    },
  });
}
