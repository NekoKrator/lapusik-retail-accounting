export interface User {
  id: string
  username: string
  role: string
}

export type Expenses = {
  terminalExpenses: number;
  rent: number;
  salaries: number;
  utilities: number;
  supplierPayments: number;
  goodsWriteOff: number;
  ownerWithdrawal: number;
  piggyBank: number;
  otherExpenses: number;
};

export type Supplier = {
  id: string
  name: string
  totalDebt: number
}

export interface LoadingScreenProps {
  message: string;
}

export type UserRole = 'admin' | 'user';

export interface RoleGuardProps {
  requiredRole: UserRole;
  children: React.ReactNode;
  loadingMessage?: string;
  redirectMessage?: string;
}

export interface ExpenseItem {
  id: string
  amount: number
  category: string
}

export interface DebtorItem {
  id: string
  name: string
  amount: number
}

export interface SupplierItem {
  id: string
  name: string
  debt: number
  pricePerDelivery: number
}

export interface BalanceItem {
  id: string;
  amount: number;
}

export interface PreviousDayInfo {
  date: string;
  actualEveningBalance?: number;
  calculatedEveningBalance: number;
}

export interface MorningBalanceProps {
  baseMorningBalance: number;
  additionalBalances: BalanceItem[];
  newBalanceAmount: string;
  onNewBalanceAmountChange: (value: string) => void;
  onAddBalance: () => void;
  onRemoveBalance: (id: string) => void;
  totalMorningBalance: number;
  previousDayInfo?: PreviousDayInfo | null;
  isLoading?: boolean;
}

export interface DebtorsSectionProps {
  debtors: DebtorItem[];
  onAddDebtor: (debtor: Omit<DebtorItem, 'id'>) => void;
  onRemoveDebtor: (id: string) => void;
  onError: (error: string) => void;
}

export interface SuppliersSectionProps {
  suppliers: SupplierItem[];
  onAddSupplier: (supplier: Omit<SupplierItem, 'id'>) => void;
  onRemoveSupplier: (id: string) => void;
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onError: (error: string) => void;
}

export interface PreviousDayData {
  date: string;
  actualEveningBalance?: number;
  calculatedEveningBalance: number;
}

export interface LocalStorageData {
  additionalBalances: BalanceItem[];
  totalCashRegister: number;
  actualEveningBalance: string;
  expenseItems: ExpenseItem[];
  lastSaved: string;
  date: string;
}

export interface CashRegisterProps {
  totalCashRegister: number;
  onTotalCashRegisterChange: (value: number) => void;
}

export type DraftData = {
  additionalBalances: { id: string; amount: number }[];
  actualEveningBalance: string;
  expenseItems: ExpenseItem[];
  totalCashRegister: number;
};