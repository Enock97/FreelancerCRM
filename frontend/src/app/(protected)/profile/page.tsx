'use client';

import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/NavBar';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
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
        <h1 className="text-2xl font-bold">Profile</h1>
        <p>Her er din profilinformasjon.</p>
      </div>
    </main>
  );
}
