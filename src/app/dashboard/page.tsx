'use client';

import DashboardClient from './DashboardClient';
import { useSession } from 'next-auth/react';
import { LoadingScreen } from '@/components/LoadingScreen';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== 'loading') {
      if (!session?.user?.username) {
        router.push('/login');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <LoadingScreen message='Перевірка авторизації...' />;
  }

  if (!session?.user?.username) {
    return <LoadingScreen message='Перенаправлення на вхід...' />;
  }

  return <DashboardClient username={session.user.username} />;
}
