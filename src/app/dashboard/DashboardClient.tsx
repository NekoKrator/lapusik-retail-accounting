'use client';

import { useSession } from 'next-auth/react';

export default function DashboardClient() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Завантаження...</div>;
  }

  if (!session) {
    return <div>Вам потрібно увійти</div>;
  }

  const { username, role } = session.user;

  if (role === 'admin') {
    // return <AdminPanel />;
    console.log('test');
  }

  if (username === 'lapusik1') {
    // return <Seller1Dashboard />;
  }

  if (username === 'lapusik2') {
    // return <Seller2Dashboard />;
  }

  // return <DefaultDashboard />;
}
