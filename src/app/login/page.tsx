'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function LoginPage() {
  const { status } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (res?.ok) {
      router.push('/dashboard');
    } else {
      setError('Невірний логін або пароль');
    }
  }

  if (status === 'loading') {
    return <div>Завантаження...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Введіть логін відділення магазину'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        disabled={loading}
        required
      ></input>
      <input
        type='password'
        placeholder='Введіть пароль відділення магазину'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        required
      ></input>
      <button type='submit' disabled={loading}>
        {loading ? 'Вхід...' : 'Увійти'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
