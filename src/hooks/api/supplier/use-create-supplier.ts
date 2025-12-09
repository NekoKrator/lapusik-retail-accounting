import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Supplier } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierCreateInput } from "@/schemas/supplier-schema";

async function postSupplier(payload: SupplierCreateInput) {
  const res = await axios.post<Supplier>(API_ENDPOINTS.SUPPLIER, payload);
  return res.data;
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postSupplier,
    onSuccess: (response) => {
      queryClient.setQueryData<Supplier[]>(
        [API_ENDPOINTS.SUPPLIER],
        (previous) => {
          if (!previous) {
            return [response];
          }

          return [response, ...previous];
        }
      );
    },
  });
}
