'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardClient({ username }: { username: string }) {
  const router = useRouter();

  useEffect(() => {
    if (username === 'lapusik1' || username === 'lapusik2') {
      router.push('/sales');
    } else if (username === 'admin') {
      router.push('/admin');
    }
  }, [username, router]);

  return <div>Redirecting...</div>;
}
