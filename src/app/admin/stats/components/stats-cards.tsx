import StatsCard, { type StatsCardProps } from "./stats-card";

type FlashCardsProps = {
  totalCashRegister: StatsCardProps;
  terminalRegister: StatsCardProps;
  totalExpenses: StatsCardProps;
};

export default function StatsCards({ ...props }: FlashCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <StatsCard {...props.totalCashRegister} />

      <StatsCard {...props.terminalRegister} />

      <StatsCard {...props.totalExpenses} />
    </div>
  );
}
