'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import ContactCard from '../../../components/ContactCard';
import { Contact } from '../../../types/types';
import {
  DndContext,
  closestCenter,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const STATUS_ENUM = {
  VENTER_PA_SVAR: 'Venter på svar',
  I_SAMTALE: 'I samtale',
  TENKER_PA_DET: 'Tenker på det',
  AVKLART: 'Avklart',
} as const;

type ContactStatus = keyof typeof STATUS_ENUM;

export default function DashboardPage() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [error, setError] = useState('');

  function normalizeStatus(status: string): ContactStatus | null {
    switch (status) {
      case 'Venter på svar': return 'VENTER_PA_SVAR';
      case 'I samtale': return 'I_SAMTALE';
      case 'Tenker på det': return 'TENKER_PA_DET';
      case 'Avklart': return 'AVKLART';
      default: return null;
    }
  }

  const fetchContacts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Kunne ikke hente kontakter');
      setContacts(data.map((c: Contact) => ({
        ...c,
        status: normalizeStatus(c.status) ?? c.status,
      })));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = (id: number) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleUpdate = async (updated: Contact) => {
    await fetch(`http://localhost:5000/api/contacts/${updated.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    });
    setContacts((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
  };

  const handleStatusChange = (contactId: number, newStatus: ContactStatus) => {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact || contact.status === newStatus) return;
    handleUpdate({ ...contact, status: newStatus });
  };

  const handleDragEnd = (event: any) => {
    const contactId = parseInt(event.active.id);
    const newStatus = event.over?.id as ContactStatus;
    if (!contactId || !newStatus) return;
    handleStatusChange(contactId, newStatus);
  };

  useEffect(() => {
    if (!isLoading && !token) router.push('/login');
    else if (token) fetchContacts();
  }, [token, isLoading]);

  if (isLoading || !token) return <p>Laster inn...</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">CRM Kanban Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STATUS_ENUM).map(([enumKey, label]) => (
            <DroppableColumn key={enumKey} id={enumKey}>
              <h2 className="font-semibold text-lg mb-2">
                {label} ({contacts.filter(c => c.status === enumKey).length})
              </h2>
              <SortableContext items={contacts.filter(c => c.status === enumKey).map(c => c.id.toString())} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {contacts
                    .filter((c) => c.status === enumKey)
                    .map((c) => (
                      <DraggableCard
                        key={c.id}
                        contact={c}
                        onDelete={handleDelete}
                        onUpdate={handleUpdate}
                        token={token}
                      />
                    ))}
                </div>
              </SortableContext>
            </DroppableColumn>
          ))}
        </div>
      </DndContext>
    </main>
  );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 p-4 rounded shadow min-h-[100px]"
    >
      {children}
    </div>
  );
}

function DraggableCard({ contact, onDelete, onUpdate, token }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: contact.id.toString(),
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ContactCard
        contact={contact}
        onDelete={onDelete}
        onUpdate={onUpdate}
        token={token}
      />
    </div>
  );
}
