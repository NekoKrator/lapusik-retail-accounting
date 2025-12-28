import type { FilterConfig } from "@/types/filter-types";

export const expenseFilterConfigs: FilterConfig[] = [
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
    label: "Категорія",
    type: "enum",
    options: [
      {
        value: "TERMINAL",
        label: "Термінал",
      },
      {
        value: "RENT",
        label: "Оренда",
      },
      {
        value: "SALARY",
        label: "Зарплати",
      },
      {
        value: "UTILITY",
        label: "Комунальні послуги",
      },
      {
        value: "GOODS_WRITE_OFF",
        label: "Списано",
      },
      {
        value: "STORE",
        label: "На магазин",
      },
      {
        value: "SUPPLIER_PAYMENT",
        label: "Постачальник",
      },
      {
        value: "OWNER_WITHDRAWAL",
        label: "Зняття власником",
      },
      {
        value: "PIGGY_BANK",
        label: "У скарбничку",
      },
      {
        value: "DEBTOR",
        label: "Боржник",
      },
      {
        value: "OTHER",
        label: "Інше",
      },
    ],
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
