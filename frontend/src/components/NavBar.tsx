'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const isActive = (path: string) =>
    pathname === path ? 'text-blue-600 font-bold' : 'text-gray-700';

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow">
      <div className="space-x-4">
        <Link href="/protected/dashboard" className={isActive('/protected/dashboard')}>
          Dashboard
        </Link>
        <Link href="/protected/contacts" className={isActive('/protected/contacts')}>
          Contacts
        </Link>
        <Link href="/protected/profile" className={isActive('/protected/profile')}>
          Profile
        </Link>
      </div>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </nav>
  );
}
