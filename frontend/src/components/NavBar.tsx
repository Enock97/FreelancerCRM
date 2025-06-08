'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0' }}>
      <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
        <li><Link href="/dashboard">Dashboard</Link></li>
        <li><Link href="/contacts">Contacts</Link></li>
        <li><Link href="/profile">Profile</Link></li>
        <li><button onClick={logout}>Log out</button></li>
      </ul>
    </nav>
  );
}
