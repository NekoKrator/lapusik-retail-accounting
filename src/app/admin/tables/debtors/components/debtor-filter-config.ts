import type { FilterConfig } from "@/types/filter-types";

export const debtorFilterConfigs: FilterConfig[] = [
  {
    key: "name",
    label: "Ім'я",
    type: "text",
    operators: ["eq"],
  },
  {
    key: "totalCurrentDebt",
    label: "Борг",
    type: "number",
  },
  {
    key: "totalDebt",
    label: "Загальна сума боргів",
    type: "number",
  },
  {
    key: "totalPaid",
    label: "Загальна сума погашення",
    type: "number",
  },
  {
    key: "activeDebtsCount",
    label: "Наявні борги",
    type: "number",
  },
  {
    key: "paidDebtsCount",
    label: "Погашені борги",
    type: "number",
  },
  {
    key: "canceledDebtsCount",
    label: "Анульовані борги",
    type: "number",
  },
  {
    key: "totalDebtsCount",
    label: "Усього боргів",
    type: "number",
  },
];
