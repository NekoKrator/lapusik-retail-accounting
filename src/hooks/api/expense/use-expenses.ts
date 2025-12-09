import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ExpenseWithInclude } from "@/schemas/expense-schema";

async function getExpenses(shiftId: string) {
  const res = await axios.get<ExpenseWithInclude[]>(
    `${API_ENDPOINTS.EXPENSE}?shiftId=${shiftId}`
  );
  return res.data;
}

export function useExpenses(shiftId: string) {
  return useQuery({
    queryKey: [API_ENDPOINTS.EXPENSE],
    queryFn: () => getExpenses(shiftId),
  });
}
