export type AdditionalIncomeListItem = {
  id: string;
  category: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;

  debtor: { id: string; name: string } | null;
};

export type AdditionalIncomeDeleteResult = {
  id: string;
};
