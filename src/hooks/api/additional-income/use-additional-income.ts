import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { AdditionalIncomeWithDebtor } from "@/schemas/additional-income-schema";

async function getAdditionalIncome(shiftId: string) {
  const res = await axios.get<AdditionalIncomeWithDebtor[]>(
    `${API_ENDPOINTS.ADDITIONAL_INCOME}?shiftId=${shiftId}`
  );
  return res.data;
}

export function useAdditionalIncome(shiftId: string) {
  return useQuery({
    queryKey: [API_ENDPOINTS.ADDITIONAL_INCOME],
    queryFn: () => getAdditionalIncome(shiftId),
  });
}
