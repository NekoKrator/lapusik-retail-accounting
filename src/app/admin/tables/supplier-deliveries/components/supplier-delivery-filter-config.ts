import type { FilterConfig } from "@/types/filter-types";

export const supplierDeliveryFilterConfigs: FilterConfig[] = [
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
    key: "supplierName",
    label: "Постачальник",
    type: "text",
    operators: ["eq"],
  },
  {
    key: "invoiceNumber",
    label: "Номер накладної",
    type: "text",
    operators: ["eq"],
  },
  {
    key: "status",
    label: "Статус",
    type: "enum",
    options: [
      {
        value: "ACTIVE",
        label: "Активна",
      },
      {
        value: "PAID",
        label: "Оплачена",
      },
      {
        value: "CANCELED",
        label: "Скасована",
      },
    ],
  },
  {
    key: "price",
    label: "Ціна",
    type: "number",
  },
  {
    key: "debt",
    label: "Борг",
    type: "number",
  },
  {
    key: "paidByCashier",
    label: "Сплачено касиром",
    type: "number",
  },
  {
    key: "paidByOwner",
    label: "Сплачено власником",
    type: "number",
  },
  {
    key: "createdAt",
    label: "Час створення",
    type: "date",
  },
  {
    key: "updatedAt",
    label: "Час оновлення",
    type: "date",
  },
];
