import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS } from "@/lib/constants/api-endpoints";
import type { ShiftCurrent } from "@/types/types";

async function getCurrentShift() {
  const res = await axios.get<ShiftCurrent>(`${API_ENDPOINTS.SHIFT}/current`);
  return res.data;
}

export function useShift() {
  return useQuery({
    queryKey: [API_ENDPOINTS.SHIFT],
    queryFn: getCurrentShift,
  });
}
