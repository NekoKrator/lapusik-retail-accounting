import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Supplier } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type { SupplierUpdateInput } from "@/schemas/supplier-schema";

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SupplierUpdateInput;
    }) => patchData<Supplier>(`${API_ENDPOINTS.SUPPLIER}/${id}`, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<Supplier[]>(
        [API_ENDPOINTS.SUPPLIER],
        (previous = []) => {
          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.id
          );

          return [response, ...listWithoutUpdatedItem];
        }
      );
    },
  });
}
