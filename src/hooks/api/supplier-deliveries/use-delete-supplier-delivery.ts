import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Expense } from "@/generated/prisma/client";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierDeliveryWithSupplierAndExpenses } from "@/schemas/supplier-delivery-schema";

async function deleteSupplierDelivery(id: string, shiftId: string) {
  const res = await axios.delete<SupplierDeliveryWithSupplierAndExpenses>(
    `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}?shiftId=${shiftId}`
  );
  return res.data;
}

export function useDeleteSupplierDelivery(shiftId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSupplierDelivery(id, shiftId),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplierAndExpenses[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (previous) => {
          if (!previous) {
            return [];
          }

          return previous.filter((d) => d.id !== response.id);
        }
      );

      queryClient.setQueryData<Expense[]>(
        [API_ENDPOINTS.EXPENSE],
        (previous) => {
          if (!previous) {
            return [];
          }

          if (response.isPaidOff) {
            return previous;
          }

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
