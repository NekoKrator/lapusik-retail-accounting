import {
  BanknoteArrowUp,
  PiggyBank,
  Receipt,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { QuickStatCard } from "./quick-stat-card";

type QuickStatsProps = {
  totalMorningBalance: number;
  totalAdditionalIncome: number;
  totalCashRegister: number;
  totalExpenses: number;
  expectedClosingBalance: number;

  isFetching: boolean;
};

export function QuickStats({
  totalMorningBalance,
  totalAdditionalIncome,
  totalCashRegister,
  totalExpenses,
  expectedClosingBalance,
  isFetching,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <QuickStatCard
        icon={Wallet}
        isFetching={isFetching}
        label="Ранковий залишок"
        value={totalMorningBalance}
        valueClassName="text-cyan-600"
      />

      <QuickStatCard
        icon={BanknoteArrowUp}
        isFetching={isFetching}
        label="Додаткові надходження"
        value={totalAdditionalIncome}
        valueClassName="text-indigo-600"
      />

      <QuickStatCard
        icon={TrendingDown}
        isFetching={isFetching}
        label="Витрати"
        value={totalExpenses}
        valueClassName="text-red-600"
      />

      <QuickStatCard
        icon={Receipt}
        isFetching={isFetching}
        label="Виторг"
        value={totalCashRegister}
        valueClassName="text-green-600"
      />

      <QuickStatCard
        icon={PiggyBank}
        isFetching={isFetching}
        label="Розрахунковий залишок"
        value={expectedClosingBalance}
        valueClassName="text-yellow-600"
      />
    </div>
  );
}
