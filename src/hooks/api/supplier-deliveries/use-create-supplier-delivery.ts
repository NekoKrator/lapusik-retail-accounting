import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { SupplierDeliveryListItem } from "@/modules/supplier-delivery/contracts";
import type { SupplierDeliveryCreateInput } from "@/schemas/supplier-delivery/supplier-delivery-schema";

export function useCreateSupplierDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupplierDeliveryCreateInput) =>
      postData<SupplierDeliveryListItem>(
        API_ENDPOINTS.SUPPLIER_DELIVERY,
        payload
      ),
    onSuccess: (res) => {
      queryClient.setQueryData<SupplierDeliveryListItem[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (prev = []) => [res, ...prev]
      );
    },
  });
}
