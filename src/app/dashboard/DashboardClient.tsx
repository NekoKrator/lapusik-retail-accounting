'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardClient({ username }: { username: string }) {
  const router = useRouter();

  useEffect(() => {
    if (username === 'lapusik1') {
      router.push('/sales');
    } else if (username === 'lapusik2') {
      router.push('/sales2');
    }
  }, [username, router]);

  return <div>Redirecting...</div>;
}
