import { BanknoteArrowUp, TrendingDown, Truck, Users } from "lucide-react";
import { memo } from "react";
import { formatCurrency } from "@/lib/formatters";
import type { AdditionalIncomeListItem } from "@/modules/additional-income/contracts";
import type { DebtorListItem } from "@/modules/debtor/contracts";
import type { ExpenseListItem } from "@/modules/expense/contracts";
import type { SupplierDeliveryListItem } from "@/modules/supplier-delivery/contracts";
import AdditionalIncomeEmpty from "./additional-income/additional-income-empty";
import AdditionalIncomeItem from "./additional-income/additional-income-item";
import AdditionalIncomeSkeleton from "./additional-income/additional-income-skeleton";
import { CreateAdditionalIncomeForm } from "./additional-income/create-additional-income-form";
import { DataSection } from "./data-section";
import { CreateDebtorForm } from "./debtors/create-debtor-form";
import DebtorItem from "./debtors/debtor-item";
import DebtorsEmpty from "./debtors/debtors-empty";
import DebtorsSkeleton from "./debtors/debtors-skeleton";
import { CreateExpenseForm } from "./expenses/create-expense-form";
import ExpenseEmpty from "./expenses/expense-empty";
import ExpenseItem from "./expenses/expense-item";
import ExpensesSkeleton from "./expenses/expenses-skeleton";
import { CreateSupplierDeliveryForm } from "./supplier-deliveries/create-supplier-delivery-form";
import SupplierDeliveriesEmpty from "./supplier-deliveries/supplier-deliveries-empty";
import SupplierDeliveriesSkeleton from "./supplier-deliveries/supplier-deliveries-skeleton";
import SupplierDeliveryItem from "./supplier-deliveries/supplier-delivery-item";

type TabProps<T> = {
  data: T[] | undefined;
  total: number;
  isLoading: boolean;
  isFetching: boolean;
  onRefresh: () => void;
};

export function additionalIncomeTab({
  data,
  total,
  isLoading,
  isFetching,
  onRefresh,
}: TabProps<AdditionalIncomeListItem>) {
  return {
    key: "additional-income",
    label: "Додаткові надходження",
    icon: BanknoteArrowUp,
    activeClass:
      "data-[state=active]:bg-indigo-600 dark:data-[state=active]:bg-indigo-600",
    count: data?.length ?? 0,
    disabled: isLoading,

    content: (
      <AdditionalIncomeTabContent
        data={data}
        isFetching={isFetching}
        onRefresh={onRefresh}
        total={total}
      />
    ),
  };
}

const AdditionalIncomeTabContent = memo(function tab({
  data,
  total,
  isFetching,
  onRefresh,
}: {
  data?: AdditionalIncomeListItem[];
  total: number;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <DataSection
      emptyState={<AdditionalIncomeEmpty />}
      icon={<BanknoteArrowUp className="h-7 w-7 text-indigo-600" />}
      isLoading={isFetching}
      items={data}
      onRefresh={onRefresh}
      renderCreateForm={<CreateAdditionalIncomeForm isLoading={isFetching} />}
      renderItem={(d) => (
        <AdditionalIncomeItem additionalIncome={d} key={d.id} />
      )}
      resultLabel="Сума додаткових надходжень"
      resultValue={formatCurrency(total)}
      resultVariant="indigo"
      skeleton={<AdditionalIncomeSkeleton />}
      title="Додаткові надходжень"
    />
  );
});

export function expensesTab({
  data,
  total,
  isLoading,
  isFetching,
  onRefresh,
}: TabProps<ExpenseListItem>) {
  return {
    key: "expenses",
    label: "Витрати",
    icon: TrendingDown,
    activeClass:
      "data-[state=active]:bg-red-600 dark:data-[state=active]:bg-red-600",
    count: data?.length ?? 0,
    disabled: isLoading,

    content: (
      <ExpenseTabContent
        data={data}
        isFetching={isFetching}
        onRefresh={onRefresh}
        total={total}
      />
    ),
  };
}

const ExpenseTabContent = memo(function tab({
  data,
  total,
  isFetching,
  onRefresh,
}: {
  data?: ExpenseListItem[];
  total: number;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <DataSection<ExpenseListItem>
      emptyState={<ExpenseEmpty />}
      icon={<TrendingDown className="h-7 w-7 text-red-600" />}
      isLoading={isFetching}
      items={data}
      onRefresh={onRefresh}
      renderCreateForm={<CreateExpenseForm isLoading={isFetching} />}
      renderItem={(d) => <ExpenseItem expense={d} key={d.id} />}
      resultLabel="Сума витрат"
      resultValue={formatCurrency(total)}
      resultVariant="red"
      skeleton={<ExpensesSkeleton />}
      title="Витрати (здано)"
    />
  );
});

export function supplierDeliveriesTab({
  data,
  total: _total,
  isLoading,
  isFetching,
  onRefresh,
}: TabProps<SupplierDeliveryListItem>) {
  return {
    key: "deliveries",
    label: "Поставки",
    icon: Truck,
    activeClass:
      "data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-600",
    count: data?.length ?? 0,
    disabled: isLoading,

    content: (
      <SupplierDeliveriesTabContent
        data={data}
        isFetching={isFetching}
        onRefresh={onRefresh}
        total={_total}
      />
    ),
  };
}

const SupplierDeliveriesTabContent = memo(function tab({
  data,
  total: _total,
  isFetching,
  onRefresh,
}: {
  data?: SupplierDeliveryListItem[];
  total: number;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <DataSection<SupplierDeliveryListItem>
      emptyState={<SupplierDeliveriesEmpty />}
      icon={<Truck className="h-7 w-7 text-blue-600" />}
      isLoading={isFetching}
      items={data}
      onRefresh={onRefresh}
      renderCreateForm={<CreateSupplierDeliveryForm isLoading={isFetching} />}
      renderItem={(d) => <SupplierDeliveryItem delivery={d} key={d.id} />}
      skeleton={<SupplierDeliveriesSkeleton />}
      title="Облік поставок"
    />
  );
});

export function debtorsTab({
  data,
  total,
  isLoading,
  isFetching,
  onRefresh,
}: TabProps<DebtorListItem>) {
  return {
    key: "debtors",
    label: "Боржники",
    icon: Users,
    activeClass:
      "data-[state=active]:bg-orange-600 dark:data-[state=active]:bg-orange-600",
    count: data?.length ?? 0,
    disabled: isLoading,

    content: (
      <DebtorsTabContent
        data={data}
        isFetching={isFetching}
        onRefresh={onRefresh}
        total={total}
      />
    ),
  };
}

const DebtorsTabContent = memo(function tab({
  data,
  total,
  isFetching,
  onRefresh,
}: {
  data?: DebtorListItem[];
  total: number;
  isFetching: boolean;
  onRefresh: () => void;
}) {
  return (
    <DataSection<DebtorListItem>
      emptyState={<DebtorsEmpty />}
      icon={<Users className="h-7 w-7 text-orange-600" />}
      isLoading={isFetching}
      items={data}
      onRefresh={onRefresh}
      renderCreateForm={<CreateDebtorForm isLoading={isFetching} />}
      renderItem={(d) => <DebtorItem debtor={d} key={d.id} />}
      resultLabel="Сума боргів"
      resultValue={formatCurrency(total)}
      resultVariant="orange"
      skeleton={<DebtorsSkeleton />}
      title="Облік боржників"
    />
  );
});
