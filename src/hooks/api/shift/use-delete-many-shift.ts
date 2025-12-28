import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { DeleteManyInput } from "@/schemas/common/delete-many-schema";

export function useDeleteManyShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteManyInput) =>
      postData<{ count: number }>(
        `${API_ENDPOINTS.SHIFT}/delete-many`,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.SHIFT],
      });
    },
  });
}
