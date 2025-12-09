import {
  BanknoteArrowUp,
  PiggyBank,
  Receipt,
  TrendingDown,
  Wallet,
} from "lucide-react";
import { QuickStatCard } from "./quick-stat-card";

type QuickStatsProps = {
  totalMorningBalance: number | null;
  totalAdditionalIncome: number | null;
  totalCashRegister: number | null;
  totalExpenses: number | null;
  expectedClosingBalance: number | null;
};

export function QuickStats({
  totalMorningBalance,
  totalAdditionalIncome,
  totalCashRegister,
  totalExpenses,
  expectedClosingBalance,
}: QuickStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <QuickStatCard
        icon={Wallet}
        label="Ранковий залишок"
        value={totalMorningBalance}
        valueClassName="text-cyan-600"
      />

      <QuickStatCard
        icon={BanknoteArrowUp}
        label="Додаткові надходження"
        value={totalAdditionalIncome}
        valueClassName="text-indigo-600"
      />

      <QuickStatCard
        icon={TrendingDown}
        label="Витрати"
        value={totalExpenses}
        valueClassName="text-red-600"
      />

      <QuickStatCard
        icon={Receipt}
        label="Виторг"
        value={totalCashRegister}
        valueClassName="text-green-600"
      />

      <QuickStatCard
        icon={PiggyBank}
        label="Розрахунковий залишок"
        value={expectedClosingBalance}
        valueClassName="text-yellow-600"
      />
    </div>
  );
}
