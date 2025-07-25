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