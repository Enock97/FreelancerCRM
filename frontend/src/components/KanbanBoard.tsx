'use client';

import { useEffect, useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { Contact } from '../types/types';
import { useAuth } from '../context/AuthContext';

const STATUSES = [
  'Venter på svar',
  'Under samtale',
  'Tenker på det',
  'Ferdig avklart',
];

export default function KanbanBoard() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);

  const fetchContacts = async () => {
    const res = await fetch('http://localhost:5000/api/contacts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setContacts(data);
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    const updated = { ...contact, status: newStatus };

    await fetch(`http://localhost:5000/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });

    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const handleDelete = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdate = (updated: Contact) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (!token) return <p>Laster inn...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {STATUSES.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          contacts={contacts.filter((c) => c.status === status)}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
          token={token}
        />
      ))}
    </div>
  );
}
