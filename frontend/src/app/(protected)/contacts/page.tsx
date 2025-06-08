'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ContactForm from './ContactForm';

interface Contact {
  id: number;
  name: string;
  email: string;
  company: string;
  status: string;
  note: string;
}

export default function ContactsPage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchContacts = async () => {
    const res = await fetch('http://localhost:5000/api/contacts', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setContacts(data);
  };

  const handleCreate = async (data: Omit<Contact, 'id'>) => {
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
    setEditingContact(null);
    fetchContacts();
  };

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5000/api/contacts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    fetchContacts();
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      <h2>Kontakter</h2>
      {showForm && (
        <ContactForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
        />
      )}
      {!showForm && (
        <button onClick={() => setShowForm(true)}>Legg til kontakt</button>
      )}

      {editingContact && (
        <ContactForm
          initialData={editingContact}
          onSubmit={handleUpdate}
          onCancel={() => setEditingContact(null)}
        />
      )}

      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <p>{contact.name} - {contact.email}</p>
            <button onClick={() => setEditingContact(contact)}>Rediger</button>
            <button onClick={() => handleDelete(contact.id)}>Slett</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
