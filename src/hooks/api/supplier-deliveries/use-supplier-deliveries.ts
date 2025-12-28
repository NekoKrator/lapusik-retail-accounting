import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, postData } from "@/lib/requests";
import type { SupplierDeliveryListItem } from "@/modules/supplier-delivery/contracts";
import type { GetSearchParam } from "@/modules/supplier-delivery/search-params";
import type { SupplierDeliveryStats } from "@/schemas/supplier-delivery/supplier-delivery-schema";
import type { SupplierDeliveryStatsInput } from "@/schemas/supplier-delivery/supplier-delivery-stats-search-params";
import type { PaginatedResponse } from "@/types/types";

export function useSupplierDeliveries(params?: GetSearchParam) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER_DELIVERY],
    queryFn: () =>
      getData<SupplierDeliveryListItem[]>(
        API_ENDPOINTS.SUPPLIER_DELIVERY,
        params
      ),
  });
}

export function useSupplierDeliveriesStats(
  payload?: SupplierDeliveryStatsInput
) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER_DELIVERY, payload],
    queryFn: () =>
      postData<PaginatedResponse<SupplierDeliveryStats>>(
        `${API_ENDPOINTS.SUPPLIER_DELIVERY}/stats`,
        payload
      ),
    staleTime: 60 * 60 * 1000,
  });
}
