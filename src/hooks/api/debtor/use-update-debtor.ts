import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type {
  DebtorUpdateInput,
  DebtorWithExpenses,
} from "@/schemas/debtor-schema";

async function updateDebtor(id: string, payload: DebtorUpdateInput) {
  const res = await axios.patch<DebtorWithExpenses>(
    `${API_ENDPOINTS.DEBTOR}/${id}`,
    payload
  );
  return res.data;
}

export function useUpdateDebtor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: DebtorUpdateInput }) =>
      updateDebtor(id, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<DebtorWithExpenses[]>(
        [API_ENDPOINTS.DEBTOR],
        (previous) => {
          if (!previous) {
            return [response];
          }

          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.id
          );

          if (response.isPaidOff) {
            return listWithoutUpdatedItem || [];
          }

          return [response, ...listWithoutUpdatedItem];
        }
      );

      // queryClient.setQueryData<AdditionalIncome[]>(
      //   [API_ENDPOINTS.ADDITIONAL_INCOME],
      //   (previous) => {
      //     const additionalIncome = response.additionalIncome.at(-1);

      //     if (additionalIncome === undefined) {
      //       return previous || [];
      //     }

      //     if (!previous) {
      //       return [additionalIncome];
      //     }

      //     return [additionalIncome, ...previous];
      //   }
      // );
    },
  });
}
