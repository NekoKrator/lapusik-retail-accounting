import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { DeleteManyInput } from "@/schemas/common/delete-many-schema";

export function useDeleteManyAdditionalIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteManyInput) =>
      postData<{ count: number }>(
        `${API_ENDPOINTS.ADDITIONAL_INCOME}/delete-many`,
        payload
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ADDITIONAL_INCOME],
      });
    },
  });
}
