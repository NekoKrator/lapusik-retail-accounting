import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Shift } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type { ShiftOpenInput } from "@/schemas/shift-schema";
import type { ShiftCurrent } from "@/types/types";

export function useOpenShift() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ShiftOpenInput) =>
      postData<Shift>(`${API_ENDPOINTS.SHIFT}/open`, payload),
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
