import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdditionalIncome } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";

async function deleteAdditionalIncome(id: string, shiftId: string) {
  const res = await axios.delete<AdditionalIncome>(
    `${API_ENDPOINTS.ADDITIONAL_INCOME}/${id}?shiftId=${shiftId}`
  );
  return res.data;
}

export function useDeleteAdditionalIncome(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAdditionalIncome(id, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<AdditionalIncome[]>(
        [API_ENDPOINTS.ADDITIONAL_INCOME],
        (previous) => {
          if (!previous) {
            return [];
          }

          return previous.filter((p) => p.id !== response.id);
        }
      );
    },
  });
}
