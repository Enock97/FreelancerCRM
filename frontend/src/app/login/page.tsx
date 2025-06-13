'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types/types';

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data: { token: string; user: User; error?: string } = await res.json();

      if (!res.ok || !data.token || !data.user) throw new Error(data.error || 'Login failed');
      login(data.token, data.user);


      login(data.token, data.user); // login funksjonen tar seg av redirect til /dashboard
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Ukjent feil ved innlogging');
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white dark:bg-gray-900 dark:text-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Logg inn</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        />
        <input
          type="password"
          placeholder="Passord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Logg inn
        </button>
      </form>
    </div>
  );
}
