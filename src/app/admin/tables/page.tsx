"use client";

import { useTables } from "@/context/tables-context";
import AdditionalIncomeTable from "./additional-income/additional-income-table";
import DebtorsTable from "./debtors/debtors-table";
import ExpensesTable from "./expenses/expenses-table";
import ShiftsTable from "./shifts/shifts-table";
import SuppliersTable from "./suppliers/suppliers-table";

export default function TablesPage() {
  const { activeTable } = useTables();

  if (!activeTable) {
    return (
      <div className="p-6 text-muted-foreground">Оберіть таблицю з меню</div>
    );
  }

  switch (activeTable) {
    case "suppliers":
      return <SuppliersTable />;

    case "shifts":
      return <ShiftsTable />;

    case "debtors":
      return <DebtorsTable />;

    case "expenses":
      return <ExpensesTable />;

    case "additional-income":
      return <AdditionalIncomeTable />;

    default:
      return null;
  }
}
