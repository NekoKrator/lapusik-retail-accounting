import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Supplier } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";

export function useDeleteSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<Supplier>(`${API_ENDPOINTS.SUPPLIER}/${id}`),
    onSuccess: (response) => {
      queryClient.setQueryData<Supplier[]>(
        [API_ENDPOINTS.SUPPLIER],
        (previous = []) => previous.filter((d) => d.id !== response.id)
      );
    },
  });
}
