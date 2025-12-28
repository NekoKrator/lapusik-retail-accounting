"use client";

import {
  BanknoteArrowUp,
  Briefcase,
  Package,
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
import SupplierDeliveriesTable from "./supplier-deliveries/supplier-deliveries-table";
import SuppliersTable from "./suppliers/suppliers-table";

const tables = [
  {
    key: "suppliers",
    title: "Постачальники",
    icon: Truck,
    component: <SuppliersTable />,
  },
  {
    key: "supplier-deliveries",
    title: "Поставки",
    icon: Package,
    component: <SupplierDeliveriesTable />,
  },
  {
    key: "shifts",
    title: "Робочі зміни",
    icon: Briefcase,
    component: <ShiftsTable />,
  },
  {
    key: "debtors",
    title: "Боржники",
    icon: Users,
    component: <DebtorsTable />,
  },
  {
    key: "additional-income",
    title: "Додаткові надходження",
    icon: BanknoteArrowUp,
    component: <AdditionalIncomeTable />,
  },
  {
    key: "expenses",
    title: "Витрати",
    icon: TrendingDown,
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
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center gap-2 px-3 pt-2">
        <table.icon />
        <TypographyH3>{table.title}</TypographyH3>
      </div>

      {table.component}
    </div>
  );
}
