import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { postData } from "@/lib/requests";
import type {
  SupplierDeliveryCreateInput,
  SupplierDeliveryWithSupplierAndExpenses,
} from "@/schemas/supplier-delivery-schema";

type CreateSupplierDeliverySearchParams = {
  shiftId: string;
};

export function useCreateSupplierDelivery(
  params: CreateSupplierDeliverySearchParams
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SupplierDeliveryCreateInput) =>
      postData<SupplierDeliveryWithSupplierAndExpenses>(
        API_ENDPOINTS.SUPPLIER_DELIVERY,
        payload,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplierAndExpenses[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (previous = []) => [response, ...previous]
      );

      queryClient.setQueryData<Expense[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous = []) => {
          const expense = response.expenses.at(-1);

          if (expense === undefined) {
            return previous;
          }

          return [expense, ...previous];
        }
      );
    },
  });
}
