'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { Expenses } from '@/types/types';

export default function SalesPage() {
  const { data: session } = useSession();

  const [morningBalance, setMorningBalance] = useState(0);
  const [totalCashRegister, setTotalCashRegister] = useState(0);
  const [actualEveningBalance, setActualEveningBalance] = useState('');
  const [expenses, setExpenses] = useState<Expenses>({
    terminalExpenses: 0,
    rent: 0,
    salaries: 0,
    utilities: 0,
    supplierPayments: 0,
    ownerWithdrawal: 0,
    piggyBank: 0,
    otherExpenses: 0,
  });

  useEffect(() => {
    const fetchMorningBalance = async () => {
      if (!session?.user) return;

      const today = new Date().toISOString().split('T')[0];

      const res = await fetch(
        `/api/daily-reports/suggested-morning-balance?userId=${session.user.id}&date=${today}`
      );
      const data = await res.json();

      if (res.ok) {
        setMorningBalance(data.suggestedMorningBalance || 0);
      } else {
        console.warn('Ошибка при получении утреннего остатка:', data.error);
      }
    };

    fetchMorningBalance();
  }, [session]);

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Expenses | 'morningBalance' | 'totalCashRegister'
  ) => {
    const val = Number(e.target.value);
    if (isNaN(val) || val < 0) return;

    if (field === 'morningBalance') setMorningBalance(val);
    else if (field === 'totalCashRegister') setTotalCashRegister(val);
    else setExpenses((prev) => ({ ...prev, [field]: val }));
  };

  const handleActualBalanceChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setActualEveningBalance(value);
    }
  };

  const totalExpenses = Object.values(expenses).reduce(
    (sum, val) => sum + val,
    0
  );
  const calculatedEveningBalance =
    morningBalance + totalCashRegister - totalExpenses;

  const actualBalance = actualEveningBalance
    ? Number(actualEveningBalance)
    : null;
  const difference =
    actualBalance !== null ? calculatedEveningBalance - actualBalance : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      alert('Не авторизован');
      return;
    }

    const payload = {
      userId: session.user.id,
      date: new Date().toISOString(),
      morningBalance,
      totalCashRegister,
      actualEveningBalance: actualBalance,
      breakdown: { ...expenses },
    };

    try {
      const res = await fetch('/api/daily-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        alert('Ошибка при отправке: ' + result.error);
        return;
      }

      alert('Успешно сохранено');
      console.log('Сменный отчёт создан:', result);

      setMorningBalance(0);
      setTotalCashRegister(0);
      setActualEveningBalance('');
      setExpenses({
        terminalExpenses: 0,
        rent: 0,
        salaries: 0,
        utilities: 0,
        supplierPayments: 0,
        ownerWithdrawal: 0,
        piggyBank: 0,
        otherExpenses: 0,
      });
    } catch (err) {
      console.error('Ошибка при отправке отчёта:', err);
      alert('Ошибка сети или сервера');
    }
  };

  return (
    <div className='max-w-lg mx-auto p-6 bg-white rounded shadow'>
      <h1 className='text-2xl font-bold mb-6'>Отчёт за смену</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block font-semibold mb-1'>Остаток на утро</label>
          <input
            type='number'
            min='0'
            step='0.01'
            value={morningBalance}
            onChange={(e) => handleNumberChange(e, 'morningBalance')}
            className='w-full border px-3 py-2 rounded'
            required
          />
        </div>

        <div>
          <label className='block font-semibold mb-1'>
            Касса за день (нал + терминал)
          </label>
          <input
            type='number'
            min='0'
            step='0.01'
            value={totalCashRegister}
            onChange={(e) => handleNumberChange(e, 'totalCashRegister')}
            className='w-full border px-3 py-2 rounded'
            required
          />
        </div>

        <fieldset className='border rounded p-4'>
          <legend className='font-semibold mb-2'>Траты (сдано)</legend>

          {(
            [
              ['Терминальные расходы', 'terminalExpenses'],
              ['Аренда', 'rent'],
              ['Зарплаты', 'salaries'],
              ['Коммунальные', 'utilities'],
              ['Поставщикам', 'supplierPayments'],
              ['Себе (взял хозяин)', 'ownerWithdrawal'],
              ['В копилку', 'piggyBank'],
              ['Прочее', 'otherExpenses'],
            ] as [string, keyof Expenses][]
          ).map(([label, key]) => (
            <div key={key} className='mb-3'>
              <label className='block mb-1'>{label}</label>
              <input
                type='number'
                min='0'
                step='0.01'
                value={expenses[key]}
                onChange={(e) => handleNumberChange(e, key)}
                className='w-full border px-3 py-2 rounded'
              />
            </div>
          ))}
        </fieldset>

        <div className='bg-gray-50 p-4 rounded'>
          <div className='text-lg font-semibold mb-2'>
            💰 Расчетный остаток на вечер: {calculatedEveningBalance.toFixed(2)}
          </div>

          <div>
            <label className='block font-semibold mb-1'>
              Фактический остаток на вечер (после подсчета)
            </label>
            <input
              type='number'
              min='0'
              step='0.01'
              value={actualEveningBalance}
              onChange={handleActualBalanceChange}
              className='w-full border px-3 py-2 rounded'
              placeholder='Введите после подсчета кассы (необязательно)'
            />
            {actualBalance !== null && (
              <div
                className={`mt-2 font-semibold ${
                  difference === 0
                    ? 'text-green-600'
                    : difference > 0
                    ? 'text-orange-600'
                    : 'text-red-600'
                }`}
              >
                Разность: {difference.toFixed(2)}
                {difference < 0 && ' (излишек)'}
                {difference > 0 && ' (недостача)'}
                {difference === 0 && ' (сходится)'}
              </div>
            )}
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition'
        >
          Сохранить отчёт
        </button>
      </form>
    </div>
  );
}
