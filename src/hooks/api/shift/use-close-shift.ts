import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Shift } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { patchData } from "@/lib/requests";
import type { ShiftCloseInput } from "@/schemas/shift/shift-schema";
import type { ShiftCurrent } from "@/types/types";

export function useCloseShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ShiftCloseInput) =>
      patchData<Shift>(`${API_ENDPOINTS.SHIFT}/close`, payload),
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

      queryClient.removeQueries({
        queryKey: [API_ENDPOINTS.EXPENSE],
      });

      queryClient.removeQueries({
        queryKey: [API_ENDPOINTS.ADDITIONAL_INCOME],
      });
    },
  });
}
