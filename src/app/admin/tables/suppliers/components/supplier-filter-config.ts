import type { FilterConfig } from "@/types/filter-types";

export const supplierFilterConfigs: FilterConfig[] = [
  {
    key: "name",
    label: "Назва",
    type: "text",
    operators: ["eq"],
  },
  {
    key: "totalCurrentDebt",
    label: "Борг",
    type: "number",
  },
  {
    key: "totalPaidByCashier",
    label: "Сплачено касиром",
    type: "number",
  },
  {
    key: "totalPaidByOwner",
    label: "Сплачено власником",
    type: "number",
  },
  {
    key: "totalPaid",
    label: "Усього сплачено",
    type: "number",
  },
  {
    key: "activeDeliveriesCount",
    label: "Поточні борги",
    type: "number",
  },
  {
    key: "paidDeliveriesCount",
    label: "Погашені борги",
    type: "number",
  },
  {
    key: "canceledDeliveriesCount",
    label: "Скасовані борги",
    type: "number",
  },
  {
    key: "totalDeliveriesCount",
    label: "Кількість поставок",
    type: "number",
  },
];
