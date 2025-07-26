import {
  Calculator,
  Receipt,
  DollarSign,
  TrendingUp,
  Wallet,
  TrendingDown,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export const expenseCategories = [
  { key: "terminalExpenses", label: "Термінал", icon: Receipt },
  { key: "rent", label: "Оренда", icon: DollarSign },
  { key: "salaries", label: "Зарплати", icon: TrendingUp },
  { key: "utilities", label: "Комунальні", icon: Calculator },
  { key: "supplierPayments", label: "Постачальникам", icon: Wallet },
  { key: "ownerWithdrawal", label: "Зняття власником", icon: TrendingDown },
  { key: "piggyBank", label: "У скарбничку", icon: CheckCircle },
  { key: "otherExpenses", label: "Інше", icon: AlertCircle },
]