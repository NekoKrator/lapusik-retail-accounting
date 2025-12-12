import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, getPaginatedData } from "@/lib/requests";
import type { SupplierWithDeliveries } from "@/schemas/supplier-schema";

type SupplierSearchParams = {
  include?: string;
  page?: number;
  limit?: number;
};

export function useSuppliers(params?: SupplierSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER],
    queryFn: () =>
      getData<SupplierWithDeliveries[]>(API_ENDPOINTS.SUPPLIER, params),
    staleTime: 60 * 60 * 1000,
  });
}

export function useSuppliersPaginated(params?: SupplierSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER, params],
    queryFn: () =>
      getPaginatedData<SupplierWithDeliveries>(API_ENDPOINTS.SUPPLIER, params),
    staleTime: 60 * 60 * 1000,
  });
}
