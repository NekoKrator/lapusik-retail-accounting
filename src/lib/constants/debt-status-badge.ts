import { CircleCheck, CircleDot, CircleMinus } from "lucide-react";

export const debtStatusBadge = [
  {
    key: "ACTIVE",
    label: "Активна",
    icon: CircleDot,
    colorClass: "text-background fill-blue-600 dark:fill-blue-500",
  },
  {
    key: "PAID",
    label: "Оплачена",
    icon: CircleCheck,
    colorClass: "text-background fill-green-500 dark:fill-green-400",
  },
  {
    key: "CANCELED",
    label: "Скасована",
    icon: CircleMinus,
    colorClass: "text-background fill-gray-500 dark:fill-gray-400",
  },
];
