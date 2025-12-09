import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Supplier } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";

async function deleteSupplier(id: string) {
  const res = await axios.delete<Supplier>(`${API_ENDPOINTS.SUPPLIER}/${id}`);
  return res.data;
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: (response) => {
      queryClient.setQueryData<Supplier[]>(
        [API_ENDPOINTS.SUPPLIER],
        (previous) => {
          if (!previous) {
            return [];
          }

          return previous.filter((d) => d.id !== response.id);
        }
      );
    },
  });
}
