import type { FilterConfig } from "@/types/filter-types";

export const additionalIncomeFilterConfigs: FilterConfig[] = [
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
    key: "category",
    label: "Джерело",
    type: "text",
    operators: ["eq"],
  },
  {
    key: "amount",
    label: "Сума",
    type: "number",
  },
  {
    key: "createdAt",
    label: "Час створення",
    type: "date",
  },
];
