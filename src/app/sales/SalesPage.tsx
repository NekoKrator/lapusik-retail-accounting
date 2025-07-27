'use client';

import type React from 'react';
import { useState, useEffect, useCallback } from 'react';
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
  Save,
  Trash2,
  Clock,
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

interface LocalStorageData {
  baseMorningBalance: number;
  additionalBalances: { id: string; amount: number }[];
  totalCashRegister: number;
  actualEveningBalance: string;
  expenseItems: ExpenseItem[];
  lastSaved: string;
  date: string; // Дата сохранения для проверки актуальности
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

  const [debtors, setDebtors] = useState<DebtorItem[]>([]);
  const [showDebtors, setShowDebtors] = useState(false);

  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [showSuppliers, setShowSuppliers] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Новые состояния для localStorage
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const LOCAL_STORAGE_KEY = 'sales-page-draft';

  // Улучшенная функция сохранения в localStorage
  const saveToLocalStorage = useCallback(() => {
    const currentDate = new Date().toISOString().split('T')[0];
    const draft: LocalStorageData = {
      baseMorningBalance,
      additionalBalances,
      totalCashRegister,
      actualEveningBalance,
      expenseItems,
      lastSaved: new Date().toISOString(),
      date: currentDate,
    };

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft));
      setLastSaved(draft.lastSaved);
      setHasUnsavedChanges(false);
      console.log('Данные сохранены в localStorage');
    } catch (error) {
      console.error('Ошибка сохранения в localStorage:', error);
      setError('Не удалось сохранить данные локально');
    }
  }, [
    baseMorningBalance,
    additionalBalances,
    totalCashRegister,
    actualEveningBalance,
    expenseItems,
  ]);

  // Автосохранение при изменении данных
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToLocalStorage();
    }, 1000); // Автосохранение через 1 секунду после изменения

    return () => clearTimeout(timeoutId);
  }, [saveToLocalStorage]);

  // Отслеживание изменений для индикации несохраненных данных
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    baseMorningBalance,
    additionalBalances,
    totalCashRegister,
    actualEveningBalance,
    expenseItems,
  ]);

  // Улучшенная функция загрузки из localStorage
  const loadFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!saved) return false;

      const data: LocalStorageData = JSON.parse(saved);
      const currentDate = new Date().toISOString().split('T')[0];

      // Проверяем, актуальны ли данные (сохранены ли они сегодня)
      if (data.date !== currentDate) {
        console.log('Данные из localStorage устарели, очищаем...');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        return false;
      }

      // Загружаем данные с проверкой на undefined/null
      if (typeof data.baseMorningBalance === 'number') {
        setBaseMorningBalance(data.baseMorningBalance);
      }

      if (Array.isArray(data.additionalBalances)) {
        setAdditionalBalances(data.additionalBalances);
      }

      if (typeof data.totalCashRegister === 'number') {
        setTotalCashRegister(data.totalCashRegister);
      }

      if (typeof data.actualEveningBalance === 'string') {
        setActualEveningBalance(data.actualEveningBalance);
      }

      if (Array.isArray(data.expenseItems)) {
        setExpenseItems(data.expenseItems);
      }

      if (data.lastSaved) {
        setLastSaved(data.lastSaved);
      }

      setHasUnsavedChanges(false);
      console.log('Данные загружены из localStorage');
      return true;
    } catch (e) {
      console.error('Не удалось прочитать localStorage:', e);
      localStorage.removeItem(LOCAL_STORAGE_KEY); // Удаляем поврежденные данные
      return false;
    }
  }, []);

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  // Очистка localStorage
  const clearLocalStorage = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setAdditionalBalances([]);
    setTotalCashRegister(0);
    setActualEveningBalance('');
    setExpenseItems([]);
    setLastSaved(null);
    setHasUnsavedChanges(false);
    setSuccess('Локальные данные очищены!');
    setTimeout(() => setSuccess(null), 2000);
  };

  // Принудительное сохранение
  const forceSave = () => {
    saveToLocalStorage();
    setSuccess('Данные сохранены!');
    setTimeout(() => setSuccess(null), 2000);
  };

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

        // Загружаем базовый баланс только если нет сохраненных данных
        const hasLocalData = loadFromLocalStorage();
        if (!hasLocalData) {
          setBaseMorningBalance(data.suggestedMorningBalance || 0);
        }

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
        if (!loadFromLocalStorage()) {
          setBaseMorningBalance(0);
        }
        setPreviousDayData(null);
      }
    };

    fetchMorningBalance();
  }, [session, loadFromLocalStorage]);

  useEffect(() => {
    async function fetchDebtors() {
      try {
        const res = await fetch('/api/debtors');
        if (!res.ok) throw new Error('Failed to fetch debtors');
        const data = await res.json();

        const mapped = data.map((d: DebtorItem) => ({
          id: d.id,
          name: d.name,
          amount: typeof d.amount === 'number' ? d.amount : 0,
        }));

        setDebtors(mapped);
      } catch (error) {
        console.error(error);
        handleError('Не вдалося завантажити боржників');
      }
    }
    fetchDebtors();
  }, []);

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
      setExpenseItems([]);

      // Очистить localStorage после успешного сохранения
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setLastSaved(null);
      setHasUnsavedChanges(false);
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
  const addOrUpdateDebtor = (newDebtor: DebtorItem) => {
    setDebtors((prev) => {
      const existingIndex = prev.findIndex((d) => d.id === newDebtor.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = newDebtor;
        return updated;
      }
      return [...prev, newDebtor];
    });
  };

  const addDebtor = async (debtor: Omit<DebtorItem, 'id'>) => {
    try {
      const res = await fetch('/api/debtors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: debtor.name,
          amount: debtor.amount,
          date: new Date().toISOString().split('T')[0],
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Помилка при створенні боржника');
      }

      const createdOrUpdated = await res.json();

      addOrUpdateDebtor(createdOrUpdated);
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Невідома помилка');
    }
  };

  const removeDebtor = async (id: string) => {
    try {
      const debtorToRemove = debtors.find((d) => d.id === id);
      if (!debtorToRemove) {
        handleError('Должник не найден');
        return;
      }

      const res = await fetch(`/api/debtors/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Помилка при видаленні боржника');
      }

      setBaseMorningBalance((prev) => prev + debtorToRemove.amount);

      setDebtors((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      handleError(error instanceof Error ? error.message : 'Невідома помилка');
    }
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
      forceSave(); // Принудительное сохранение при быстром сохранении кассы
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

  // Функция для форматирования времени последнего сохранения
  const formatLastSaved = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('uk-UA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
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

            {/* Индикатор сохранения */}
            <div className='flex items-center justify-center gap-4 mt-2 text-sm'>
              {lastSaved && (
                <div className='flex items-center gap-1 text-green-600'>
                  <Clock className='h-4 w-4' />
                  <span>Останнє збереження: {formatLastSaved(lastSaved)}</span>
                </div>
              )}
              {hasUnsavedChanges && (
                <div className='flex items-center gap-1 text-orange-600'>
                  <AlertCircle className='h-4 w-4' />
                  <span>Незбережені зміни</span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Кнопки управления localStorage */}
        <div className='flex gap-2 justify-center'>
          <Button
            type='button'
            onClick={forceSave}
            variant='outline'
            size='sm'
            className='flex items-center gap-1'
          >
            <Save className='h-4 w-4' />
            Зберегти зараз
          </Button>
          <Button
            type='button'
            onClick={clearLocalStorage}
            variant='outline'
            size='sm'
            className='flex items-center gap-1 text-red-600 hover:text-red-700'
          >
            <Trash2 className='h-4 w-4' />
            Очистити дані
          </Button>
        </div>

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
