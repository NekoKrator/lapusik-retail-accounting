import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type {
  SupplierDeliveryUpdateInput,
  SupplierDeliveryWithSupplierAndExpenses,
} from "@/schemas/supplier-delivery-schema";

async function updateSupplierDelivery(
  id: string,
  payload: SupplierDeliveryUpdateInput
) {
  const res = await axios.patch<SupplierDeliveryWithSupplierAndExpenses>(
    `${API_ENDPOINTS.SUPPLIER_DELIVERY}/${id}`,
    payload
  );
  return res.data;
}

export function useUpdateSupplierDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: SupplierDeliveryUpdateInput;
    }) => updateSupplierDelivery(id, payload),
    onSuccess: (response) => {
      queryClient.setQueryData<SupplierDeliveryWithSupplierAndExpenses[]>(
        [API_ENDPOINTS.SUPPLIER_DELIVERY],
        (previous) => {
          if (!previous) {
            return [response];
          }

          const listWithoutUpdatedItem = previous.filter(
            (p) => p.id !== response.id
          );

          if (response.isPaidOff) {
            return listWithoutUpdatedItem || [];
          }

          return [response, ...listWithoutUpdatedItem];
        }
      );

      // queryClient.setQueryData<AdditionalIncome[]>(
      //   [API_ENDPOINTS.ADDITIONAL_INCOME],
      //   (previous) => {
      //     const additionalIncome = response.additionalIncome.at(-1);

      //     if (additionalIncome === undefined) {
      //       return previous || [];
      //     }

      //     if (!previous) {
      //       return [additionalIncome];
      //     }

      //     return [additionalIncome, ...previous];
      //   }
      // );
    },
  });
}
