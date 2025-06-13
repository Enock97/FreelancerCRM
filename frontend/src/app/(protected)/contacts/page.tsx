'use client';

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import ContactForm from './ContactForm';
import ContactCard from '@/components/ContactCard';
import { Contact } from '../../../types/types';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CONTACTS } from '../../graphql/queries';
import {
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
} from '../../graphql/mutations';

export default function ContactsPage() {
  const { token } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS, {
    skip: !token,
    context: { headers: { Authorization: `Bearer ${token}` } },
  });

  const [createContact] = useMutation(CREATE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    onCompleted: () => refetch(),
  });

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    onCompleted: () => refetch(),
  });

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    onCompleted: () => refetch(),
  });

  const handleCreate = async (input: Omit<Contact, 'id' | 'createdAt'>) => {
    await createContact({ variables: { data: input } });
    setShowForm(false);
  };

  const handleUpdate = async (input: Contact) => {
    await updateContact({ variables: { data: input } });
  };

  const handleDelete = async (id: number) => {
    await deleteContact({ variables: { id } });
  };

  if (loading) return <p>Laster inn...</p>;
  if (error) return <p className="text-red-600">Feil: {error.message}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6 text-black dark:text-white">
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
        {data.contacts.map((contact: Contact) => (
          <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md" key={contact.id}>
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
