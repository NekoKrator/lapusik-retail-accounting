import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Shift } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ShiftOpenInput } from "@/schemas/shift-schema";
import type { ShiftCurrent } from "@/types/types";

async function openShift(payload: ShiftOpenInput) {
  const res = await axios.post<Shift>(`${API_ENDPOINTS.SHIFT}/open`, payload);
  return res.data;
}

export function useOpenShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openShift,
    onSuccess: (response) => {
      queryClient.setQueryData<ShiftCurrent>(
        [API_ENDPOINTS.SHIFT],
        (previous) => {
          if (!previous) {
            return { currentShift: response, lastClosedShift: null };
          }

          return {
            ...previous,
            currentShift: response,
          };
        }
      );
    },
  });
}
