"use client";

import {
  BanknoteArrowUp,
  Briefcase,
  TrendingDown,
  Truck,
  Users,
} from "lucide-react";
import { TypographyH3 } from "@/components/ui/typography";
import { useTables } from "@/context/tables-context";
import AdditionalIncomeTable from "./additional-income/additional-income-table";
import DebtorsTable from "./debtors/debtors-table";
import ExpensesTable from "./expenses/expenses-table";
import ShiftsTable from "./shifts/shifts-table";
import SuppliersTable from "./suppliers/suppliers-table";

const tables = [
  {
    key: "suppliers",
    title: "Постачальники",
    icon: <Truck className="text-blue-600" />,
    component: <SuppliersTable />,
  },
  {
    key: "shifts",
    title: "Робочі зміни",
    icon: <Briefcase className="text-violet-600" />,
    component: <ShiftsTable />,
  },
  {
    key: "debtors",
    title: "Боржники",
    icon: <Users className="text-orange-600" />,
    component: <DebtorsTable />,
  },
  {
    key: "additional-income",
    title: "Додаткові надходження",
    icon: <BanknoteArrowUp className="text-indigo-600" />,
    component: <AdditionalIncomeTable />,
  },
  {
    key: "expenses",
    title: "Витрати",
    icon: <TrendingDown className="text-red-600" />,
    component: <ExpensesTable />,
  },
];

export default function TablesPage() {
  const { activeTable } = useTables();

  const table = tables.find((t) => t.key === activeTable);

  if (!table) {
    return (
      <div className="p-6 text-muted-foreground">Оберіть таблицю з меню</div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col gap-4 px-6">
      <div className="flex items-center gap-2">
        {table.icon}
        <TypographyH3>{table.title}</TypographyH3>
      </div>

      <div className="flex-1">{table.component}</div>
    </div>
  );
}
