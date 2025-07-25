'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Lock } from 'lucide-react';
import LoadingScreen from '@/components/LoadingScreen';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router, mounted]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });

      if (res?.ok) {
        router.push('/dashboard');
      } else {
        setError(res?.error || 'Невірний логін або пароль');
      }
    } catch {
      setError("Помилка з'єднання");
    } finally {
      setLoading(false);
    }
  }

  if (!mounted || status === 'loading') {
    return <LoadingScreen message='Перевірка авторизації...' />;
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50 p-4'>
      <div className='w-full max-w-md space-y-8'>
        {/* Logo Section */}
        <div className='text-center'>
          <div className='flex justify-center mb-6'>
            <Image
              src='/lapusik-logo.png'
              alt='Зоомагазин Лапусик'
              width={300}
              height={120}
              className='h-auto max-w-full'
              priority
            />
          </div>
        </div>

        {/* Login Card */}
        <Card className='shadow-xl border-0 bg-white/95 backdrop-blur'>
          <CardHeader className='space-y-1 text-center'>
            <CardTitle className='text-2xl font-bold text-gray-800'>
              Вхід для співробітників
            </CardTitle>
            <CardDescription className='text-gray-600'>
              Введіть дані для доступу до системи
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label
                  htmlFor='username'
                  className='text-sm font-medium text-gray-700'
                >
                  Логін відділення
                </Label>
                <div className='relative'>
                  <User className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='username'
                    type='text'
                    placeholder='Введіть логін відділення магазину'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                    required
                    className='pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='password'
                  className='text-sm font-medium text-gray-700'
                >
                  Пароль
                </Label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                  <Input
                    id='password'
                    type='password'
                    placeholder='Введіть пароль відділення магазину'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                    className='pl-10 h-12 border-gray-200 focus:border-green-500 focus:ring-green-500'
                  />
                </div>
              </div>

              {error && (
                <Alert
                  variant='destructive'
                  className='bg-red-50 border-red-200'
                >
                  <AlertDescription className='text-red-700'>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type='submit'
                disabled={loading}
                className='w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors'
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Вхід...
                  </>
                ) : (
                  'Увійти'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className='text-center text-sm text-gray-500'>
          <p>© 2025 Зоомагазин Лапусик. Система для співробітників.</p>
        </div>
      </div>
    </div>
  );
}
