export type User = {
    id: string;
    username: string;
    role: string;
};

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
    id: string;
    name: string;
};

export interface LoadingScreenProps {
    message: string;
}

export type UserRole = "admin" | "user";

export interface RoleGuardProps {
    requiredRoles: UserRole[];
    children: React.ReactNode;
    loadingMessage?: string;
    redirectMessage?: string;
}

export interface ExpenseItem {
    id: string;
    amount: number;
    category: string;
}

export type PaymentType = "CASH" | "OWNER";

export interface SupplierItem {
    id: string;
    supplierId: string;
    supplierName: string;
    totalPrice: number;
    debt: number;
    paymentType: PaymentType;
    paidOff: boolean;
    date: Date;
}

export interface BalanceItem {
    id: string;
    amount: number;
    category: string;
}

export interface PreviousDayData {
    date: string;
    actualEveningBalance: number;
    calculatedEveningBalance?: number;
}

export interface MorningBalanceProps {
    baseMorningBalance: number;
    additionalBalances: BalanceItem[];
    newBalanceAmount: string;
    onNewBalanceAmountChange: (value: string) => void;
    newBalanceCategory: string;
    onNewBalanceCategoryChange: (value: string) => void;
    onAddBalance: () => void;
    onRemoveBalance: (id: string) => void;
    totalMorningBalance: number;
    previousDayInfo?: PreviousDayData | null;
    isLoading?: boolean;
}

export interface SuppliersSectionProps {
    suppliers: Supplier[];
    supplierItems: SupplierItem[];
    onAddSupplier: (supplier: Omit<SupplierItem, "id">) => void;
    onUpdateSupplier: (
        id: string,
        updates: Partial<SupplierItem>
    ) => Promise<void>;
    onRemoveSupplier: (id: string) => void;
    onAddExpense: (expense: Omit<ExpenseItem, "id">) => void;
    onError: (error: string) => void;
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

export interface DailyReport {
    userId?: string;
    date: string;
    morningBalance: number;
    additionalBalance: number;
    cashRegister: number;
    expenses: number;
    difference: number;
    expectedBalance: number;
    actualBalance: number;
    expensesByCategory: Record<string, number>;
    createdAt?: string;
    firstRecordTime: number;
    lastRecordTime: number;
}

export interface StatsResponse {
    daily: DailyReport[];
    expensesByCategory: Record<string, number>;
    totalDifference: number;
    totalExpenses: number;
    totalIncome: number;
}

export interface DashboardCards {
    data: StatsResponse;
}

export interface RevenueChart {
    data: {
        formattedDate: string;
        date: string;
        cashRegister: number;
        expenses: number;
        expectedBalance: number;
        actualBalance: number | null;
        difference: number;
    }[];
}

export interface ExpensesBarChart {
    data: { category: string; value: number }[];
}

export interface ExpensesPieChart {
    data: { category: string; value: number }[];
}

export interface DailyReportsTable {
    data: {
        formattedDate: string;
        date: string;
        morningBalance: number;
        additionalBalance: number;
        cashRegister: number;
        expenses: number;
        expectedBalance: number;
        actualBalance: number | null;
        difference: number;
    }[];
}
