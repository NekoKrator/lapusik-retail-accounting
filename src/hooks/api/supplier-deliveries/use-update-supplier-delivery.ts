import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type {
  SupplierDeliveryUpdateInput,
  SupplierDeliveryWithSupplierAndExpenses,
} from "@/schemas/supplier-delivery-schema";

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
      patchData<SupplierDeliveryWithSupplierAndExpenses>(
        `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}`,
        payload
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
    },
  });
}
