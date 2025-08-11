import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, Plus, Trash2, AlertCircle } from 'lucide-react';
import { expenseCategories } from '@/lib/constants/expense-categories';
import type { ExpenseItem } from '@/types/types';

interface ExpensesSectionProps {
  expenseItems: ExpenseItem[];
  onAddExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  onRemoveExpense: (id: string) => void;
  onError: (error: string) => void;
  totalExpenses: number;
}

export function ExpensesSection({
  expenseItems,
  onAddExpense,
  onRemoveExpense,
  onError,
  totalExpenses,
}: ExpensesSectionProps) {
  const [newExpense, setNewExpense] = useState({
    amount: '',
    category: 'otherExpenses',
  });

  const handleAdd = () => {
    if (!newExpense.amount || Number(newExpense.amount) <= 0) {
      onError('Будь ласка, введіть коректну суму');
      return;
    }
    onAddExpense({
      amount: Number(newExpense.amount),
      category: newExpense.category,
    });
    setNewExpense({ amount: '', category: 'otherExpenses' });
  };

  const getCategoryIcon = (category: string) => {
    const cat = expenseCategories.find((c) => c.key === category);
    const IconComponent = cat?.icon || AlertCircle;
    return <IconComponent className='h-4 w-4' />;
  };

  const getCategoryLabel = (category: string) => {
    const cat = expenseCategories.find((c) => c.key === category);
    return cat?.label || 'Інше';
  };

  return (
    <Card className='shadow-lg border-0 bg-white/95 backdrop-blur'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <TrendingDown className='h-5 w-5 text-red-600' />
          Витрати (здано)
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Add New Expense */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg'>
          <Input
            type='number'
            min='0'
            value={newExpense.amount}
            onChange={(e) =>
              setNewExpense((prev) => ({ ...prev, amount: e.target.value }))
            }
            placeholder='Сума'
          />
          <select
            value={newExpense.category}
            onChange={(e) =>
              setNewExpense((prev) => ({ ...prev, category: e.target.value }))
            }
            className='h-10 px-3 border border-gray-200 rounded-md focus:border-green-500 focus:ring-green-500'
          >
            {expenseCategories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
          <Button
            type='button'
            onClick={handleAdd}
            className='bg-green-600 hover:bg-green-700 text-white'
          >
            <Plus className='h-4 w-4 mr-2' />
            Додати
          </Button>
        </div>

        {/* Expense Items List */}
        {expenseItems.length > 0 && (
          <div className='space-y-2'>
            {expenseItems.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between p-2 bg-white rounded border'
              >
                <div className='flex items-center gap-2'>
                  {getCategoryIcon(item.category)}
                  <Badge variant='secondary' className='text-xs'>
                    {getCategoryLabel(item.category)}
                  </Badge>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='font-bold text-red-600'>
                    ₴
                    {typeof item.amount === 'number'
                      ? item.amount.toFixed(2)
                      : '0.00'}
                  </span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => onRemoveExpense(item.id)}
                    className='text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              </div>
            ))}
            <div className='p-2 bg-red-50 rounded border border-red-200'>
              <div className='text-center'>
                <span className='text-lg font-bold text-red-700'>
                  ₴{totalExpenses.toFixed(2)}
                </span>
                <span className='text-sm text-red-600 ml-2'>
                  Загальні витрати
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
