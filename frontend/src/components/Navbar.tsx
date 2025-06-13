'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import DarkModeToggle from '../styles/DarkModeToggle';

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow px-6 py-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link href="/" className="text-lg font-semibold">FreelancerCRM</Link>
        {token && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/contacts">Kontakter</Link>
            <Link href="/profile">Profil</Link>
          </>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <DarkModeToggle />
        {token && (
          <button onClick={logout} className="text-red-500 hover:text-red-600">Logg ut</button>
        )}
      </div>
    </nav>
  );
}
