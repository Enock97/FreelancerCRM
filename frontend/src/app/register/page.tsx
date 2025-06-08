'use client';

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export default function RegisterPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { email, password });
      login(res.data.token);
    } catch {
      setError('Brukeren finnes kanskje allerede');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-4 border rounded">
      <h1 className="text-2xl font-bold mb-4">Registrer deg</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-post" required className="w-full p-2 border" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passord" required className="w-full p-2 border" />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Registrer</button>
      </form>
    </div>
  );
}
