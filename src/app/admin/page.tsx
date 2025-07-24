import { useSession } from 'next-auth/react';

export default function SalesPage() {
  const { data: session } = useSession();

  return <h1>Hello, {session?.user.username}</h1>;
}
