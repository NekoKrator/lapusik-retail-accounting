import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Supplier } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { SupplierCreateInput } from "@/schemas/supplier-schema";

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupplierCreateInput) =>
      postData<Supplier>(API_ENDPOINTS.SUPPLIER, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<Supplier[]>(
        [API_ENDPOINTS.SUPPLIER],
        (previous = []) => [response, ...previous]
      );
    },
  });
}
