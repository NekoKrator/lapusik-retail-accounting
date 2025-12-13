import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type {
  SupplierDeliveryCreateInput,
  SupplierDeliveryWithSupplier,
} from "@/schemas/supplier-delivery-schema";

export function useCreateSupplierDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupplierDeliveryCreateInput) =>
      postData<SupplierDeliveryWithSupplier>(
        API_ENDPOINTS.SUPPLIER_DELIVERY,
        payload
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplier[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (previous = []) => [response, ...previous]
      );
    },
  });
}
