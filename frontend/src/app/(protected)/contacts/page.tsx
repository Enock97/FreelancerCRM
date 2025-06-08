'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import Navbar from '../../../components/NavBar';

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  note: string;
  createdAt: string;
}

export default function ContactsPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (!isLoading && !token) {
      router.push('/login');
    }
  }, [token, isLoading, router]);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!token) return;

      const res = await fetch('http://localhost:3001/api/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setContacts(data);
      } else {
        console.error('Klarte ikke hente kontakter');
      }
    };

    fetchContacts();
  }, [token]);

  if (isLoading || !token) return <p>Laster inn...</p>;

  return (
    <main>
      <Navbar />
      <div className="p-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <p>Her vises dine kontakter.</p>
      </div>
    </main>
  );
}