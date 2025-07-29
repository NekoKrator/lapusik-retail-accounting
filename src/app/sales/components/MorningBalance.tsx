import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Wallet,
  Plus,
  Trash2,
  Info,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import type { MorningBalanceProps } from '@/types/types';

export function MorningBalance({
  baseMorningBalance,
  additionalBalances,
  newBalanceAmount,
  onNewBalanceAmountChange,
  onAddBalance,
  onRemoveBalance,
  totalMorningBalance,
  previousDayInfo,
  isLoading = false,
}: MorningBalanceProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getBalanceSourceInfo = () => {
    if (!previousDayInfo) {
      return {
        text: 'Немає даних за попередній день',
        icon: AlertCircle,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
      };
    }

    const hasActualBalance = previousDayInfo.actualEveningBalance !== undefined;

    if (hasActualBalance) {
      return {
        text: `Фактичний залишок за ${formatDate(previousDayInfo.date)}`,
        icon: CheckCircle,
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
      };
    } else {
      return {
        text: `Розрахунковий залишок за ${formatDate(previousDayInfo.date)}`,
        icon: Info,
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
      };
    }
  };

  const sourceInfo = getBalanceSourceInfo();
  const IconComponent = sourceInfo.icon;

  if (isLoading) {
    return (
      <Card className='shadow-lg border-0 bg-white/95 backdrop-blur'>
        <CardHeader className='pb-4'>
          <CardTitle className='text-lg flex items-center gap-2'>
            <Wallet className='h-5 w-5 text-green-600' />
            Залишок на ранок
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-center p-8'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-600'></div>
            <span className='ml-3 text-gray-600'>Завантаження даних...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='shadow-lg border-0 bg-white/95 backdrop-blur'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Wallet className='h-5 w-5 text-green-600' />
          Залишок на ранок
        </CardTitle>
        <CardDescription className='text-sm text-gray-600'>
          Залишок попереднього дня та додаткові надходження до каси
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div
          className={`p-3 rounded-lg border ${sourceInfo.bgColor} ${sourceInfo.borderColor}`}
        >
          <div className='flex items-center justify-between mb-2'>
            <div className='flex items-center gap-2'>
              <IconComponent className={`h-4 w-4 ${sourceInfo.color}`} />
              <span className={`text-sm leading-none ${sourceInfo.color}`}>
                Базова сума{' '}
                {previousDayInfo && `(${formatDate(previousDayInfo.date)})`}
              </span>
            </div>
            <span className={`font-bold ${sourceInfo.color}`}>
              ₴{baseMorningBalance.toFixed(2)}
            </span>
          </div>
        </div>

        <Separator />

        <div className='flex gap-2'>
          <Input
            type='number'
            min='0'
            value={newBalanceAmount}
            onChange={(e) => onNewBalanceAmountChange(e.target.value)}
            placeholder='Додаткова сума'
            className='flex-1'
          />
          <Button
            type='button'
            onClick={onAddBalance}
            size='sm'
            className='bg-green-600 hover:bg-green-700 text-white'
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        {additionalBalances.length > 0 && (
          <div className='space-y-2'>
            <div className='text-sm text-gray-600 font-medium'>
              Додаткові суми:
            </div>
            {additionalBalances.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between p-2 bg-white rounded border'
              >
                <span className='text-sm font-medium text-green-600'>
                  ₴{item.amount.toFixed(2)}
                </span>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => onRemoveBalance(item.id)}
                  className='text-red-600 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0'
                >
                  <Trash2 className='h-3 w-3' />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Separator />

        <div className='p-3 bg-green-100 rounded-lg border border-green-300'>
          <div className='text-center'>
            <div className='text-xl font-bold text-green-700'>
              ₴{totalMorningBalance.toFixed(2)}
            </div>
            <div className='text-sm text-green-600'>
              Загальний ранковий залишок
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
