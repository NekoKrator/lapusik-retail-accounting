import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdditionalIncome } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";

type DeleteAdditionalIncomeSearchParams = {
  shiftId: string;
};

export function useDeleteAdditionalIncome(
  params: DeleteAdditionalIncomeSearchParams
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<AdditionalIncome>(
        `${API_ENDPOINTS.ADDITIONAL_INCOME}/${id}`,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<AdditionalIncome[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME, params],
        (previous = []) => previous.filter((p) => p.id !== response.id)
      );
    },
  });
}
