import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Shift } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ShiftCloseInput } from "@/schemas/shift-schema";
import type { ShiftCurrent } from "@/types/types";

async function closeShift(payload: ShiftCloseInput) {
  const res = await axios.patch<Shift>(`${API_ENDPOINTS.SHIFT}/close`, payload);
  return res.data;
}

export function useCloseShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: closeShift,
    onSuccess: (response) => {
      queryClient.setQueryData<ShiftCurrent>(
        [API_ENDPOINTS.SHIFT],
        (previous) => {
          if (!previous) {
            return { currentShift: null, lastClosedShift: response };
          }

          return {
            currentShift: null,
            lastClosedShift: response,
          };
        }
      );
    },
  });
}
