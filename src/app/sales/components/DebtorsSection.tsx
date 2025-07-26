import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Plus, Trash2 } from 'lucide-react';
import type { DebtorItem } from '@/types/types';

interface DebtorsSectionProps {
  debtors: DebtorItem[];
  onAddDebtor: (debtor: Omit<DebtorItem, 'id'>) => void;
  onRemoveDebtor: (id: string) => void;
  onError: (error: string) => void;
}

export function DebtorsSection({
  debtors,
  onAddDebtor,
  onRemoveDebtor,
  onError,
}: DebtorsSectionProps) {
  const [newDebtor, setNewDebtor] = useState({ name: '', amount: '' });

  const handleAdd = () => {
    if (
      !newDebtor.name.trim() ||
      !newDebtor.amount ||
      Number(newDebtor.amount) <= 0
    ) {
      onError('Будь ласка, заповніть всі поля коректно');
      return;
    }
    onAddDebtor({
      name: newDebtor.name.trim(),
      amount: Number(newDebtor.amount),
    });
    setNewDebtor({ name: '', amount: '' });
  };

  return (
    <Card className='shadow-lg border-0 bg-white/95 backdrop-blur'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Users className='h-5 w-5 text-orange-600' />
          Облік боржників
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Add New Debtor */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg'>
          <Input
            value={newDebtor.name}
            onChange={(e) =>
              setNewDebtor((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Ім'я боржника"
          />
          <Input
            type='number'
            min='0'
            value={newDebtor.amount}
            onChange={(e) =>
              setNewDebtor((prev) => ({ ...prev, amount: e.target.value }))
            }
            placeholder='Сума боргу'
          />
          <Button
            type='button'
            onClick={handleAdd}
            className='bg-orange-600 hover:bg-orange-700 text-white'
          >
            <Plus className='h-4 w-4 mr-2' />
            Додати
          </Button>
        </div>

        {/* Debtors List */}
        {debtors.length > 0 && (
          <div className='space-y-2'>
            {debtors.map((debtor) => (
              <div
                key={debtor.id}
                className='flex items-center justify-between p-2 bg-white rounded border'
              >
                <span className='font-medium'>{debtor.name}</span>
                <div className='flex items-center gap-3'>
                  <span className='font-bold text-orange-600'>
                    ₴{debtor.amount.toFixed(2)}
                  </span>
                  <Button
                    type='button'
                    variant='ghost'
                    size='sm'
                    onClick={() => onRemoveDebtor(debtor.id)}
                    className='text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0'
                  >
                    <Trash2 className='h-3 w-3' />
                  </Button>
                </div>
              </div>
            ))}
            <div className='p-2 bg-orange-50 rounded border border-orange-200'>
              <div className='text-center'>
                <span className='text-lg font-bold text-orange-700'>
                  ₴{debtors.reduce((sum, d) => sum + d.amount, 0).toFixed(2)}
                </span>
                <span className='text-sm text-orange-600 ml-2'>
                  Загальна сума боргів
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
