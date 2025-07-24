'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function DashboardClient({ username }: { username: string }) {
  const router = useRouter();

  useEffect(() => {
    if (username === 'lapusik1' || username === 'lapusik2') {
      router.push('/sales');
    } else if (username === 'admin') {
      router.push('/admin');
    } else {
      router.push('/login');
    }
  }, [username, router]);

  return <LoadingScreen message='Перенаправлення, будь ласка, зачекайте...' />;
}
