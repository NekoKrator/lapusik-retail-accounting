import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type {
  SupplierDeliveryCreateInput,
  SupplierDeliveryWithSupplierAndExpenses,
} from "@/schemas/supplier-delivery-schema";

async function postSupplierDelivery(
  payload: SupplierDeliveryCreateInput,
  shiftId: string
) {
  const res = await axios.post<SupplierDeliveryWithSupplierAndExpenses>(
    `${API_ENDPOINTS.SUPPLIER_DELIVERY}?shiftId=${shiftId}`,
    payload
  );
  return res.data;
}

export function useCreateSupplierDelivery(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupplierDeliveryCreateInput) =>
      postSupplierDelivery(payload, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplierAndExpenses[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (previous) => {
          if (!previous) {
            return [response];
          }
          return [response, ...previous];
        }
      );

      queryClient.setQueryData<Expense[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous) => {
          const expense = response.expenses.at(-1);

          if (expense === undefined) {
            return previous || [];
          }

          if (!previous) {
            return [expense];
          }

          return [expense, ...previous];
        }
      );
    },
  });
}
