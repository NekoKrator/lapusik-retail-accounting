import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, getPaginatedData } from "@/lib/requests";
import type { SupplierDeliveryWithSupplier } from "@/schemas/supplier-delivery-schema";

type SupplierDeliveriesSearchParams = {
  isPaidOff?: string;
  page?: string;
  limit?: string;
};

export function useSupplierDeliveries(params?: SupplierDeliveriesSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER_DELIVERY],
    queryFn: () =>
      getData<SupplierDeliveryWithSupplier[]>(
        API_ENDPOINTS.SUPPLIER_DELIVERY,
        params
      ),
    staleTime: 60 * 60 * 1000,
  });
}

export function useSupplierDeliveriesPaginated(
  params?: SupplierDeliveriesSearchParams
) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER_DELIVERY, params],
    queryFn: () =>
      getPaginatedData<SupplierDeliveryWithSupplier>(
        API_ENDPOINTS.SUPPLIER_DELIVERY,
        params
      ),
    staleTime: 60 * 60 * 1000,
  });
}
