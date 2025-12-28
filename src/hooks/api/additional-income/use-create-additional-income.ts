import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { AdditionalIncomeListItem } from "@/modules/additional-income/contracts";
import type { CreateSearchParams } from "@/modules/additional-income/search-params";
import type { AdditionalIncomeCreateInput } from "@/schemas/additional-income/additional-income-schema";

export function useCreateAdditionalIncome(params: CreateSearchParams) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdditionalIncomeCreateInput) =>
      postData<AdditionalIncomeListItem>(
        API_ENDPOINTS.ADDITIONAL_INCOME,
        payload,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<AdditionalIncomeListItem[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME],
        (previous = []) => [response, ...previous]
      );
    },
  });
}
