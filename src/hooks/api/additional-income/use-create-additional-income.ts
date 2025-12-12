import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type {
  AdditionalIncomeCreateInput,
  AdditionalIncomeWithDebtor,
} from "@/schemas/additional-income-schema";

type CreateAdditionalIncomeSearchParams = {
  shiftId: string;
};

export function useCreateAdditionalIncome(
  params: CreateAdditionalIncomeSearchParams
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdditionalIncomeCreateInput) =>
      postData<AdditionalIncomeWithDebtor>(
        API_ENDPOINTS.ADDITIONAL_INCOME,
        payload,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<AdditionalIncomeWithDebtor[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME, params],
        (previous = []) => [response, ...previous]
      );
    },
  });
}
