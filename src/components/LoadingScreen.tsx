import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import type { LoadingScreenProps } from '@/types/types';

export function LoadingScreen({ message }: LoadingScreenProps) {
  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50'>
      <Card className='w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur'>
        <CardContent className='flex flex-col items-center justify-center p-8 space-y-4'>
          <div className='flex items-center space-x-2 text-green-600'>
            <Image
              src='/lapusik-logo.png'
              alt='Зоомагазин Лапусик'
              width={225}
              height={90}
              className='h-auto max-w-full'
              priority
            />
          </div>

          <div className='flex items-center space-x-3'>
            <Loader2 className='h-6 w-6 animate-spin text-green-600' />
            <span className='text-lg text-gray-600 font-medium'>{message}</span>
          </div>

          {/* Animated dots
          <div className='flex space-x-1'>
            <div
              className='w-2 h-2 bg-[#03933a] rounded-full animate-bounce'
              style={{ animationDelay: '0ms' }}
            ></div>
            <div
              className='w-2 h-2 bg-[#fcfe06] rounded-full animate-bounce'
              style={{ animationDelay: '150ms' }}
            ></div>
            <div
              className='w-2 h-2 bg-[#03933a] rounded-full animate-bounce'
              style={{ animationDelay: '300ms' }}
            ></div>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
