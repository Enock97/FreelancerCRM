'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

interface User {
  id: number;
  email: string;
}

export default function ProfilePage() {
  const { token, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch profile');

        setUser(data);
      } catch (err: any) {
        if (err.message === 'Unauthorized') logout();
        else setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, logout]);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1>Profile</h1>
      {loading && <p>Loading profile...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user && (
        <div>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
      <button onClick={logout} style={{ marginTop: '1rem' }}>
        Log out
      </button>
    </div>
  );
}
