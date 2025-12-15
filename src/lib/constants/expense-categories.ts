import {
  AlertCircle,
  Calculator,
  CircleMinus,
  DollarSign,
  PiggyBank,
  Receipt,
  Store,
  TrendingDown,
  TrendingUp,
  Truck,
  Users,
} from "lucide-react";

export const expenseCategories = [
  { key: "TERMINAL", label: "Термінал", icon: Receipt },
  { key: "RENT", label: "Оренда", icon: DollarSign },
  { key: "SALARY", label: "Зарплати", icon: TrendingUp },
  { key: "UTILITY", label: "Комунальні послуги", icon: Calculator },
  { key: "GOODS_WRITE_OFF", label: "Списано", icon: CircleMinus },
  { key: "STORE", label: "На магазин", icon: Store },
  { key: "SUPPLIER_PAYMENT", label: "Постачальник", icon: Truck },
  { key: "OWNER_WITHDRAWAL", label: "Зняття власником", icon: TrendingDown },
  { key: "PIGGY_BANK", label: "У скарбничку", icon: PiggyBank },
  { key: "DEBTOR", label: "Боржник", icon: Users },
  { key: "OTHER", label: "Інше", icon: AlertCircle },
];
