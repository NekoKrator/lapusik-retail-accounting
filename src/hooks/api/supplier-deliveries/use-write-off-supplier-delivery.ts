import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type {
  SupplierDeliveryWithSupplier,
  SupplierDeliveryWriteOffInput,
} from "@/schemas/supplier-delivery-schema";

async function writeOffSupplierDelivery(
  id: string,
  payload: SupplierDeliveryWriteOffInput,
  shiftId: string
) {
  const res = await axios.patch<SupplierDeliveryWithSupplier>(
    `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}/write-off?shiftId=${shiftId}`,
    payload
  );
  return res.data;
}

export function useWriteOffSupplierDelivery(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SupplierDeliveryWriteOffInput;
    }) => writeOffSupplierDelivery(id, payload, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplier[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (previous) => {
          if (!previous) {
            return [response];
          }

          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.id
          );

          if (response.isPaidOff) {
            return listWithoutUpdatedItem || [];
          }

          return [response, ...listWithoutUpdatedItem];
        }
      );
    },
  });
}
