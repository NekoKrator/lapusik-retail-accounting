import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { SupplierDeliveryWithSupplier } from "@/schemas/supplier-delivery-schema";

async function getSupplierDeliveries() {
  const res = await axios.get<SupplierDeliveryWithSupplier[]>(
    `${API_ENDPOINTS.SUPPLIER_DELIVERY}?isPaidOff=false`
  );
  return res.data;
}

export function useSupplierDeliveries() {
  return useQuery({
    queryKey: [API_ENDPOINTS.SUPPLIER_DELIVERY],
    queryFn: getSupplierDeliveries,
  });
}
