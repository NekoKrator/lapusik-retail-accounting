import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdditionalIncome } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { AdditionalIncomeCreateInput } from "@/schemas/additional-income-schema";

async function postAdditionalIncome(
  payload: AdditionalIncomeCreateInput,
  shiftId: string
) {
  const res = await axios.post<AdditionalIncome>(
    `${API_ENDPOINTS.ADDITIONAL_INCOME}?shiftId=${shiftId}`,
    payload
  );
  return res.data;
}

export function useCreateAdditionalIncome(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AdditionalIncomeCreateInput) =>
      postAdditionalIncome(payload, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<AdditionalIncome[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME],
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
