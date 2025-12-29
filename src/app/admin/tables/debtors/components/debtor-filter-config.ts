import type { FilterConfig } from "@/types/filter-types";

export const debtorFilterConfigs: FilterConfig[] = [
  {
    key: "displayUsername",
    label: "Відділ",
    type: "enum",
    options: [
      {
        value: "1 Відділ - Палацова 2",
        label: "1 Відділ - Палацова 2",
      },
      {
        value: "2 Відділ - Єдності 80",
        label: "2 Відділ - Єдності 80",
      },
    ],
  },
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
