import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { SupplierListItem } from "@/modules/supplier/contracts";
import type { SupplierCreateInput } from "@/schemas/supplier/supplier-schema";

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupplierCreateInput) =>
      postData<SupplierListItem>(API_ENDPOINTS.SUPPLIER, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierListItem[]>(
        [API_ENDPOINTS.SUPPLIER],
        (previous = []) => [response, ...previous]
      );
    },
  });
}
