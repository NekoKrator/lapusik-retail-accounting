import { Card, CardContent } from '@/components/ui/card';
import { Wallet, Receipt, TrendingDown, PiggyBank } from 'lucide-react';

interface QuickStatsProps {
  totalMorningBalance: number;
  totalCashRegister: number;
  totalExpenses: number;
  calculatedEveningBalance: number;
}

export function QuickStats({
  totalMorningBalance,
  totalCashRegister,
  totalExpenses,
  calculatedEveningBalance,
}: QuickStatsProps) {
  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
      <Card className='bg-white/95 backdrop-blur border-0 shadow-md'>
        <CardContent className='p-4 text-center'>
          <div className='flex items-center justify-center mb-2'>
            <Wallet className='h-5 w-5 text-green-600' />
          </div>
          <div className='text-lg font-bold text-green-600'>
            ₴{totalMorningBalance.toFixed(2)}
          </div>
          <div className='text-xs text-gray-600'>Ранковий залишок</div>
        </CardContent>
      </Card>
      <Card className='bg-white/95 backdrop-blur border-0 shadow-md'>
        <CardContent className='p-4 text-center'>
          <div className='flex items-center justify-center mb-2'>
            <Receipt className='h-5 w-5 text-blue-600' />
          </div>
          <div className='text-lg font-bold text-blue-600'>
            ₴{totalCashRegister.toFixed(2)}
          </div>
          <div className='text-xs text-gray-600'>Виручка</div>
        </CardContent>
      </Card>
      <Card className='bg-white/95 backdrop-blur border-0 shadow-md'>
        <CardContent className='p-4 text-center'>
          <div className='flex items-center justify-center mb-2'>
            <TrendingDown className='h-5 w-5 text-red-600' />
          </div>
          <div className='text-lg font-bold text-red-600'>
            ₴{totalExpenses.toFixed(2)}
          </div>
          <div className='text-xs text-gray-600'>Витрати</div>
        </CardContent>
      </Card>
      <Card className='bg-white/95 backdrop-blur border-0 shadow-md'>
        <CardContent className='p-4 text-center'>
          <div className='flex items-center justify-center mb-2'>
            <PiggyBank className='h-5 w-5 text-yellow-600' />
          </div>
          <div className='text-lg font-bold text-yellow-600'>
            ₴{calculatedEveningBalance.toFixed(2)}
          </div>
          <div className='text-xs text-gray-600'>Залишок</div>
        </CardContent>
      </Card>
    </div>
  );
}
