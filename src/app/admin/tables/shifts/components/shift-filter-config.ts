import type { FilterConfig } from "@/types/filter-types";

export const shiftFilterConfigs: FilterConfig[] = [
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
    key: "isClosed",
    label: "Статус",
    type: "enum",
    options: [
      {
        value: "true",
        label: "Закрита",
      },
      {
        value: "false",
        label: "Відкрита",
      },
    ],
  },
  {
    key: "openedAt",
    label: "Час початку",
    type: "date",
  },
  {
    key: "totalCashRegister",
    label: "Виторг",
    type: "number",
  },
  {
    key: "terminalRegister",
    label: "Термінал",
    type: "number",
  },
  {
    key: "openingBalance",
    label: "Ранковий залишок",
    type: "number",
  },
  {
    key: "totalAdditionalIncome",
    label: "Додаткові надходження",
    type: "number",
  },
  {
    key: "totalExpenses",
    label: "Витрати",
    type: "number",
  },
  {
    key: "expectedClosingBalance",
    label: "Розрахунковий залишок",
    type: "number",
  },
  {
    key: "actualClosingBalance",
    label: "Фактичний залишок",
    type: "number",
  },
  {
    key: "shiftDuration",
    label: "Час зміни (секунди)",
    type: "number",
  },
  {
    key: "closedAt",
    label: "Час закриття",
    type: "date",
  },
];
