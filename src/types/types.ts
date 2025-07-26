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