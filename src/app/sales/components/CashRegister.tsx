import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Receipt } from 'lucide-react';

interface CashRegisterProps {
  totalCashRegister: number;
  onTotalCashRegisterChange: (value: number) => void;
  onQuickSave: () => void;
}

export function CashRegister({
  totalCashRegister,
  onTotalCashRegisterChange,
  onQuickSave,
}: CashRegisterProps) {
  return (
    <Card className='shadow-lg border-0 bg-white/95 backdrop-blur'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Receipt className='h-5 w-5 text-blue-600' />
          Каса за день
        </CardTitle>

        <CardDescription className='text-sm text-gray-600'>
          Загальна сума готівки та терміналу за день
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Single Total Input */}

        <div className='space-y-2'>
          <Input
            type='number'
            min='0'
            value={totalCashRegister}
            onChange={(e) =>
              onTotalCashRegisterChange(Number(e.target.value) || 0)
            }
            placeholder='Введіть загальну суму'
            className='h-12 text-lg font-medium border-gray-200 focus:border-blue-500 focus:ring-blue-500'
            required
          />
        </div>

        <Separator />

        {/* Quick Save Button */}

        <div className='pt-2'>
          <Button
            type='button'
            onClick={onQuickSave}
            disabled={totalCashRegister <= 0}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 disabled:opacity-50'
          >
            <Receipt className='mr-2 h-4 w-4' />
            Зберегти касу
          </Button>
        </div>

        <Separator />

        <div className='p-3 bg-blue-100 rounded-lg border border-blue-300'>
          <div className='text-center'>
            <div className='text-xl font-bold text-blue-700'>
              ₴{totalCashRegister.toFixed(2)}
            </div>

            <div className='text-sm text-blue-600'>Виручка за день</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
