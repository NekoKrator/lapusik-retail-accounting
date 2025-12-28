import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";
import type {
  AdditionalIncomeDeleteResult,
  AdditionalIncomeListItem,
} from "@/modules/additional-income/contracts";

export function useDeleteAdditionalIncome() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<AdditionalIncomeDeleteResult>(
        `${API_ENDPOINTS.ADDITIONAL_INCOME}/${id}`
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<AdditionalIncomeListItem[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME],
        (previous = []) => previous.filter((p) => p.id !== response.id)
      );
    },
  });
}
