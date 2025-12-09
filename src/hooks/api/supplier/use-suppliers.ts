import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierWithDeliveries } from "@/schemas/supplier-schema";

async function getSuppliers() {
  const res = await axios.get<SupplierWithDeliveries[]>(
    `${API_ENDPOINTS.SUPPLIER}?include=deliveries`
  );
  return res.data;
}

export function useSuppliers() {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER],
    queryFn: getSuppliers,
    staleTime: 12 * 60 * 60 * 1000,
  });
}
