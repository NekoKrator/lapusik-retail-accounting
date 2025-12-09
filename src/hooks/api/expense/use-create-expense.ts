import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type {
  ExpenseCreateInput,
  ExpenseWithInclude,
} from "@/schemas/expense-schema";

async function postExpense(payload: ExpenseCreateInput, shiftId: string) {
  const res = await axios.post<ExpenseWithInclude>(
    `${API_ENDPOINTS.EXPENSE}?shiftId=${shiftId}`,
    payload
  );
  return res.data;
}

export function useCreateExpense(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ExpenseCreateInput) => postExpense(payload, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<ExpenseWithInclude[]>(
        [API_ENDPOINTS.EXPENSE],
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
