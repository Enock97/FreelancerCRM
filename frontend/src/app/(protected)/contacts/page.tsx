'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ContactForm from './ContactForm';
import ContactCard from '@/components/ContactCard';
import { Contact } from '../../../types/types';

export default function ContactsPage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchContacts = async () => {
    const res = await fetch('http://localhost:5000/api/contacts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setContacts(data);
  };

  const handleCreate = async (data: Omit<Contact, 'id' | 'createdAt'>) => {
    await fetch('http://localhost:5000/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    fetchContacts();
  };

  const handleUpdate = async (data: Contact) => {
    await fetch(`http://localhost:5000/api/contacts/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    fetchContacts();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/contacts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchContacts();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold mb-4">Kontakter</h2>

      {showForm ? (
        <ContactForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow"
        >
          Legg til kontakt
        </button>
      )}

      <div className="space-y-6">
        {contacts.map((contact) => (
          <div className="bg-white p-4 rounded-2xl shadow-md" key={contact.id}>
            <ContactCard
              contact={contact}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              token={token!}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
