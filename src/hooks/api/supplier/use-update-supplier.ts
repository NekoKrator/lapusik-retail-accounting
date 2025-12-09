import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Supplier } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierUpdateInput } from "@/schemas/supplier-schema";

async function writeOffSupplier(id: string, payload: SupplierUpdateInput) {
  const res = await axios.patch<Supplier>(
    `${API_ENDPOINTS.SUPPLIER}/${id}`,
    payload
  );
  return res.data;
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SupplierUpdateInput;
    }) => writeOffSupplier(id, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<Supplier[]>(
        [API_ENDPOINTS.SUPPLIER],
        (previous) => {
          if (!previous) {
            return [response];
          }

          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.id
          );

          return [response, ...listWithoutUpdatedItem];
        }
      );
    },
  });
}
