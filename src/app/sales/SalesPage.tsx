'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calculator,
  Users,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { useSession } from 'next-auth/react';

import { QuickStats } from './components/QuickStats';
import { DebtorsSection } from './components/DebtorsSection';
import { SuppliersSection } from './components/SuppliersSection';
import { MorningBalance } from './components/MorningBalance';
import { CashRegister } from './components/CashRegister';
import { ExpensesSection } from './components/ExpensesSection';
import { FinalCalculations } from './components/FinalCalculations';

import type { ExpenseItem, DebtorItem, SupplierItem } from '@/types/types';

interface PreviousDayData {
  date: string;
  actualEveningBalance?: number;
  calculatedEveningBalance: number;
}

export default function SalesPage() {
  const { data: session } = useSession();

  const [baseMorningBalance, setBaseMorningBalance] = useState(0);
  const [previousDayData, setPreviousDayData] =
    useState<PreviousDayData | null>(null);

  const [additionalBalances, setAdditionalBalances] = useState<
    { id: string; amount: number }[]
  >([]);
  const [newBalanceAmount, setNewBalanceAmount] = useState('');
  const [totalCashRegister, setTotalCashRegister] = useState(0);
  const [actualEveningBalance, setActualEveningBalance] = useState('');
  const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);

  // Debtors state
  const [debtors, setDebtors] = useState<DebtorItem[]>([]);
  const [showDebtors, setShowDebtors] = useState(false);

  // Suppliers state
  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [showSuppliers, setShowSuppliers] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchMorningBalance = async () => {
      const today = new Date().toISOString().split('T')[0];
      try {
        const res = await fetch(
          `/api/daily-reports/suggested-morning-balance?userId=${session.user.id}&date=${today}`
        );
        if (!res.ok) throw new Error('Failed to fetch morning balance');
        const data = await res.json();

        setBaseMorningBalance(data.suggestedMorningBalance || 0);

        setPreviousDayData({
          date: new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
          actualEveningBalance: data.actualEveningBalance ?? undefined,
          calculatedEveningBalance:
            data.calculatedEveningBalance ?? data.suggestedMorningBalance ?? 0,
        });
      } catch (err) {
        console.error(err);
        setBaseMorningBalance(0);
        setPreviousDayData(null);
      }
    };

    fetchMorningBalance();
  }, [session]);

  // Функция для сохранения отчета с обновлением логики
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!session?.user) {
      setError('Не авторизовано');
      setLoading(false);
      return;
    }

    try {
      // Подготовить данные для отправки
      const reportData = {
        date: new Date().toISOString().split('T')[0],
        userId: session.user.id,
        morningBalance:
          baseMorningBalance +
          additionalBalances.reduce((sum, item) => sum + item.amount, 0),
        totalCashRegister: totalCashRegister,
        breakdown: {
          // здесь нужно заполнить поля расходов, например из твоих state
          terminalExpenses: 0,
          ownerWithdrawal: 0,
          rent: 0,
          utilities: 0,
          supplierPayments: 0,
          salaries: 0,
          piggyBank: 0,
          otherExpenses: 0,
        },
        actualEveningBalance: actualEveningBalance
          ? Number(actualEveningBalance)
          : null,
      };

      // Отправляем POST запрос
      const res = await fetch('/api/daily-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Помилка при збереженні звіту');
      }

      setSuccess('Звіт успішно збережено!');

      // Очистить дополнительные балансы, кассу и т.д.
      setAdditionalBalances([]);
      setTotalCashRegister(0);
      setActualEveningBalance('');
      // сюда добавь сброс других полей, если надо
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Balance handlers
  const addBalanceItem = () => {
    if (!newBalanceAmount || Number(newBalanceAmount) <= 0) {
      setError('Будь ласка, введіть коректну суму');
      return;
    }
    const item = {
      id: Date.now().toString(),
      amount: Number(newBalanceAmount),
    };
    setAdditionalBalances((prev) => [...prev, item]);
    setNewBalanceAmount('');
    setError(null);
  };

  const removeBalanceItem = (id: string) => {
    setAdditionalBalances((prev) => prev.filter((item) => item.id !== id));
  };

  // Expense handlers
  const addExpenseItem = (expense: Omit<ExpenseItem, 'id'>) => {
    const item: ExpenseItem = {
      id: Date.now().toString(),
      ...expense,
    };
    setExpenseItems((prev) => [...prev, item]);
  };

  const removeExpenseItem = (id: string) => {
    setExpenseItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Debtors handlers
  const addDebtor = (debtor: Omit<DebtorItem, 'id'>) => {
    const item: DebtorItem = {
      id: Date.now().toString(),
      ...debtor,
    };
    setDebtors((prev) => [...prev, item]);
  };

  const removeDebtor = (id: string) => {
    setDebtors((prev) => prev.filter((item) => item.id !== id));
  };

  // Suppliers handlers
  const addSupplier = (supplier: Omit<SupplierItem, 'id'>) => {
    const item: SupplierItem = {
      id: Date.now().toString(),
      ...supplier,
    };
    setSuppliers((prev) => [...prev, item]);
  };

  const removeSupplier = (id: string) => {
    setSuppliers((prev) => prev.filter((item) => item.id !== id));
  };

  // Cash register handlers
  const handleQuickSave = () => {
    if (totalCashRegister > 0) {
      setSuccess('Каса збережена!');
      setTimeout(() => setSuccess(null), 2000);
    } else {
      setError('Введіть суму каси');
      setTimeout(() => setError(null), 2000);
    }
  };

  // Error handler
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 3000);
  };

  // Calculations
  const totalExpenses = expenseItems.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalMorningBalance =
    baseMorningBalance +
    additionalBalances.reduce((sum, item) => sum + item.amount, 0);
  const calculatedEveningBalance =
    totalMorningBalance + totalCashRegister - totalExpenses;
  const actualBalance = actualEveningBalance
    ? Number(actualEveningBalance)
    : null;
  const difference =
    actualBalance !== null ? calculatedEveningBalance - actualBalance : 0;

  return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4'>
      <div className='max-w-6xl mx-auto space-y-6'>
        {/* Header */}
        <Card className='shadow-xl border-0 bg-white/95 backdrop-blur'>
          <CardHeader className='text-center pb-4'>
            <CardTitle className='text-3xl font-bold text-gray-800 flex items-center justify-center gap-2'>
              <Calculator className='h-8 w-8 text-green-600' />
              Звіт за зміну
            </CardTitle>
            <CardDescription className='text-gray-600'>
              Ведення обліку доходів та витрат за робочу зміну
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <QuickStats
          totalMorningBalance={totalMorningBalance}
          totalCashRegister={totalCashRegister}
          totalExpenses={totalExpenses}
          calculatedEveningBalance={calculatedEveningBalance}
        />

        {/* Action Buttons */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Button
            type='button'
            onClick={() => setShowDebtors(!showDebtors)}
            variant={showDebtors ? 'default' : 'outline'}
            className='h-12 font-medium'
          >
            <Users className='h-5 w-5 mr-2' />
            Боржники ({debtors.length})
          </Button>
          <Button
            type='button'
            onClick={() => setShowSuppliers(!showSuppliers)}
            variant={showSuppliers ? 'default' : 'outline'}
            className='h-12 font-medium'
          >
            <Truck className='h-5 w-5 mr-2' />
            Постачальники ({suppliers.length})
          </Button>
        </div>

        {/* Debtors Section */}
        {showDebtors && (
          <DebtorsSection
            debtors={debtors}
            onAddDebtor={addDebtor}
            onRemoveDebtor={removeDebtor}
            onError={handleError}
          />
        )}

        {/* Suppliers Section */}
        {showSuppliers && (
          <SuppliersSection
            suppliers={suppliers}
            onAddSupplier={addSupplier}
            onRemoveSupplier={removeSupplier}
            onAddExpense={addExpenseItem}
            onError={handleError}
          />
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Balance and Cash Section */}
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Morning Balance */}
            <MorningBalance
              baseMorningBalance={baseMorningBalance}
              additionalBalances={additionalBalances}
              newBalanceAmount={newBalanceAmount}
              onNewBalanceAmountChange={setNewBalanceAmount}
              onAddBalance={addBalanceItem}
              onRemoveBalance={removeBalanceItem}
              totalMorningBalance={totalMorningBalance}
              previousDayInfo={previousDayData}
            />

            {/* Daily Cash Register */}
            <CashRegister
              totalCashRegister={totalCashRegister}
              onTotalCashRegisterChange={setTotalCashRegister}
              onQuickSave={handleQuickSave}
            />
          </div>

          {/* Expenses Section */}
          <ExpensesSection
            expenseItems={expenseItems}
            onAddExpense={addExpenseItem}
            onRemoveExpense={removeExpenseItem}
            onError={handleError}
            totalExpenses={totalExpenses}
          />

          {/* Final Calculations */}
          <FinalCalculations
            calculatedEveningBalance={calculatedEveningBalance}
            actualEveningBalance={actualEveningBalance}
            onActualEveningBalanceChange={setActualEveningBalance}
            actualBalance={actualBalance}
            difference={difference}
          />

          {/* Alerts */}
          {error && (
            <Alert variant='destructive' className='bg-red-50 border-red-200'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription className='text-red-700'>
                {error}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className='bg-green-50 border-green-200'>
              <CheckCircle className='h-4 w-4 text-green-600' />
              <AlertDescription className='text-green-700'>
                {success}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={loading}
            className='w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors'
          >
            {loading ? (
              <>
                <Calculator className='mr-2 h-4 w-4 animate-spin' />
                Збереження...
              </>
            ) : (
              <>
                <CheckCircle className='mr-2 h-4 w-4' />
                Зберегти звіт
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
