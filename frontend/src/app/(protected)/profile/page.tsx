'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function ProfilePage() {
  const { token, isLoading, user, logout } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    company: '',
    location: '',
  });

  useEffect(() => {
    if (!isLoading && !token) router.push('/login');

    if (token) {
      const stored = localStorage.getItem('profile_data');
      if (stored && stored !== 'undefined') {
        try {
          setForm((prev) => ({
            ...JSON.parse(stored),
            email: user?.email || '',
            password: '********',
          }));
        } catch {
          setForm((prev) => ({
            ...prev,
            email: user?.email || '',
          }));
        }
      } else {
        setForm((prev) => ({
          ...prev,
          email: user?.email || '',
        }));
      }
    }
  }, [token, isLoading, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const updated = { ...form };

    try {
      const res = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: updated.email,
          password: updated.password !== '********' ? updated.password : undefined,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Noe gikk galt');
      }

      if (updated.password !== '********') {
        updated.password = '********';
      }

      localStorage.setItem('profile_data', JSON.stringify(updated));
      setForm(updated);
    } catch (err) {
      console.error('Feil ved lagring:', err);
    }
  };

  if (isLoading || !token) return null;

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 relative">
        <h1 className="text-3xl font-bold mb-6 text-center">Min Profil</h1>

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block font-medium mb-1">E-post</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block font-medium mb-1">Passord</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* Lokale felt */}
          {['name', 'phone', 'company', 'location'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block font-medium mb-1 capitalize">{field}</label>
              <input
                id={field}
                name={field}
                value={form[field as keyof typeof form]}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
            </div>
          ))}
        </div>

        <div className="pt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
          >
            Lagre
          </button>
        </div>
      </div>
    </main>
  );
}
