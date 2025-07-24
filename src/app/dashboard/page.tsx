'use client';

import DashboardClient from './DashboardClient';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Загрузка...</div>;
  if (!session?.user?.username) return <div>Нет доступа</div>;

  return <DashboardClient username={session.user.username} />;
}
