import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type {
  SupplierDeliveryWithSupplier,
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
      patchData<SupplierDeliveryWithSupplier>(
        `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}/write-off`,
        payload,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplier[]>(
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
