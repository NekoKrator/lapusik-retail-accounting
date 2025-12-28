import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, postData } from "@/lib/requests";
import type { SupplierListItem } from "@/modules/supplier/contracts";
import type { SupplierStats } from "@/schemas/supplier/supplier-schema";
import type { SupplierStatsInput } from "@/schemas/supplier/supplier-stats-search-payload";
import type { PaginatedResponse } from "@/types/types";

export function useSuppliers() {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER],
    queryFn: () => getData<SupplierListItem[]>(API_ENDPOINTS.SUPPLIER),
    staleTime: 60 * 60 * 1000,
  });
}

export function useSuppliersStats(payload?: SupplierStatsInput) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER, payload],
    queryFn: () =>
      postData<PaginatedResponse<SupplierStats>>(
        `${API_ENDPOINTS.SUPPLIER}/stats`,
        payload
      ),
    staleTime: 60 * 60 * 1000,
  });
}
