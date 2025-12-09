import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Debtor } from "@/generated/prisma/client";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";

async function getDebtors() {
  const res = await axios.get<Debtor[]>(
    `${API_ENDPOINTS.DEBTOR}?isPaidOff=false`
  );
  return res.data;
}

export function useDebtors() {
  return useQuery({
    queryKey: [API_ENDPOINTS.DEBTOR],
    queryFn: getDebtors,
  });
}
