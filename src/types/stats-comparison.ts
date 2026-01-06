export type Period = "1d" | "7d" | "30d" | "3m" | "6m" | "12m" | "custom";

export type CustomRange = {
  from: Date;
  to: Date;
};

export type ChangeResult = {
  change: string;
  changeType: "positive" | "negative";
};
