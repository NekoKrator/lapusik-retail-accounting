import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { deleteData } from "@/lib/requests";
import type { SupplierDeliveryWithSupplierAndExpenses } from "@/schemas/supplier-delivery-schema";

type DeleteSupplierDeliverySearchParams = {
  shiftId: string;
};

export function useDeleteSupplierDelivery(
  params: DeleteSupplierDeliverySearchParams
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      deleteData<SupplierDeliveryWithSupplierAndExpenses>(
        `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}`,
        params
      ),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplierAndExpenses[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (previous = []) => previous.filter((d) => d.id !== response.id)
      );

      queryClient.setQueryData<Expense[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous = []) => {
          const expenseIdsToDelete = response.expenses.map(
            (expense) => expense.id
          );

          return previous.filter(
            (previousExpense) =>
              !expenseIdsToDelete.includes(previousExpense.id)
          );
        }
      );
    },
  });
}
