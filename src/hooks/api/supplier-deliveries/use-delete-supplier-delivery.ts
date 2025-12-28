import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";
import type {
  SupplierDeliveryDeleteResult,
  SupplierDeliveryListItem,
} from "@/modules/supplier-delivery/contracts";

type DeleteSupplierDeliverySearchParams = {
  shiftId: string;
};

export function useDeleteSupplierDelivery(
  params: DeleteSupplierDeliverySearchParams
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<SupplierDeliveryDeleteResult>(
        `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}`,
        params
      ),
    onSuccess: (res) => {
      queryClient.setQueryData<SupplierDeliveryListItem[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (prev = []) => prev.filter((i) => i.id !== res.id)
      );
    },
  });
}
