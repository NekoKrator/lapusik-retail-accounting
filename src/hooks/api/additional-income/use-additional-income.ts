import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import { getData, getPaginatedData } from "@/lib/requests";
import type { AdditionalIncomeWithDebtor } from "@/schemas/additional-income-schema";

type AdditionalIncomeSearchParams = {
  shiftId?: string;
  page?: number;
  limit?: number;
};

export function useAdditionalIncome(params?: AdditionalIncomeSearchParams) {
  return useQuery({
    queryKey: [API_ENDPOINTS.ADDITIONAL_INCOME],
    queryFn: () =>
      getData<AdditionalIncomeWithDebtor[]>(
        API_ENDPOINTS.ADDITIONAL_INCOME,
        params
      ),
    staleTime: 60 * 60 * 1000,
  });
}

export function useAdditionalIncomePaginated(
  params?: AdditionalIncomeSearchParams
) {
  return useQuery({
    queryKey: [API_ENDPOINTS.ADDITIONAL_INCOME, params],
    queryFn: () =>
      getPaginatedData<AdditionalIncomeWithDebtor>(
        API_ENDPOINTS.ADDITIONAL_INCOME,
        params
      ),
    staleTime: 60 * 60 * 1000,
  });
}
