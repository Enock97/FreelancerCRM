'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/NavBar';

export default function DashboardPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  if (isLoading || !token) return <p>Laster inn...</p>;

  return (
    <main>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p>Velkommen til dashbordet ditt.</p>
      </div>
    </main>
  );
}
