"use client";

import {
  BanknoteArrowUp,
  Briefcase,
  Package,
  TrendingDown,
  Truck,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import type { TableKey } from "@/context/tables-context";
import { useCurrentTable } from "@/hooks/use-current-table";
import AdditionalIncomeTable from "./additional-income/additional-income-table";
import DebtorsTable from "./debtors/debtors-table";
import ExpensesTable from "./expenses/expenses-table";
import ShiftsTable from "./shifts/shifts-table";
import SupplierDeliveriesTable from "./supplier-deliveries/supplier-deliveries-table";
import SuppliersTable from "./suppliers/suppliers-table";

const tables = [
  {
    key: "shifts",
    title: "Робочі зміни",
    icon: Briefcase,
    component: <ShiftsTable />,
  },
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
  const { mounted, currentTable, setCurrentTable } = useCurrentTable();

  if (!mounted) {
    return (
      <div className="flex size-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const handleClick = (key: TableKey) => {
    setCurrentTable(key);
  };

  const table = tables.find((t) => t.key === currentTable);

  if (!table) {
    return (
      <div className="p-6 text-muted-foreground">Оберіть таблицю з меню</div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <div className="flex items-center gap-2 px-3 pt-3">
        <Select
          onValueChange={(value: TableKey) => handleClick(value)}
          value={currentTable}
        >
          <SelectTrigger className="h-12 w-fit justify-normal border-0 font-semibold text-2xl tracking-tight shadow-none hover:bg-accent hover:text-accent-foreground focus-visible:border-ring-0 focus-visible:ring-0 dark:bg-transparent dark:hover:bg-input/50 [&_svg:not([class*='size-'])]:size-7 [&_svg]:size-5">
            <SelectValue placeholder="Оберіть таблицю" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {tables.map((item) => (
                <SelectItem
                  className="font-medium"
                  key={item.key}
                  value={item.key}
                >
                  <item.icon className="text-accent-foreground" />
                  <span>{item.title}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {table.component}
    </div>
  );
}
