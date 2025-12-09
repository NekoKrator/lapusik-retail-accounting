import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdditionalIncome } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type {
  DebtorWithAdditionalIncome,
  DebtorWriteOffInput,
} from "@/schemas/debtor-schema";

async function writeOffDebtor(
  id: string,
  payload: DebtorWriteOffInput,
  shiftId: string
) {
  const res = await axios.patch<DebtorWithAdditionalIncome>(
    `${API_ENDPOINTS.DEBTOR}/${id}/write-off?shiftId=${shiftId}`,
    payload
  );
  return res.data;
}

export function useWriteOffDebtor(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: DebtorWriteOffInput;
    }) => writeOffDebtor(id, payload, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<DebtorWithAdditionalIncome[]>(
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

      queryClient.setQueryData<AdditionalIncome[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME],
        (previous) => {
          const additionalIncome = response.additionalIncome.at(-1);

          if (additionalIncome === undefined) {
            return previous || [];
          }

          if (!previous) {
            return [additionalIncome];
          }

          return [additionalIncome, ...previous];
        }
      );
    },
  });
}
