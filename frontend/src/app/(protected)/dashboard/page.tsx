'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import ContactCard from '../../../components/ContactCard';
import {
  DndContext,
  closestCenter,
  useDroppable,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CONTACTS } from '../../graphql/queries';
import { UPDATE_CONTACT } from '../../graphql/mutations';
import { Contact } from '../../../types/types';

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

  const { data, loading, error, refetch } = useQuery(GET_CONTACTS, {
    skip: !token,
  });

  const [updateContact] = useMutation(UPDATE_CONTACT);

  const contacts: Contact[] = data?.contacts ?? [];

  const handleDelete = () => {
    refetch();
  };

  const handleUpdate = async (updated: Contact) => {
    await updateContact({ variables: { data: updated } });
    refetch();
  };

  const handleStatusChange = (contactId: number, newStatus: ContactStatus) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (!contact || contact.status === newStatus) return;
    handleUpdate({ ...contact, status: newStatus });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const contactId = parseInt(event.active.id as string);
    const newStatus = event.over?.id as ContactStatus;
    if (!contactId || !newStatus) return;
    handleStatusChange(contactId, newStatus);
  };

  useEffect(() => {
    if (!isLoading && !token) router.push('/login');
  }, [token, isLoading, router]);

  if (isLoading || loading || !token) return <p>Laster inn...</p>;
  if (error) return <p className="text-red-500">Feil ved henting av data</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">CRM Kanban Dashboard</h1>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(STATUS_ENUM).map(([enumKey, label]) => (
            <DroppableColumn key={enumKey} id={enumKey}>
              <h2 className="font-semibold text-lg mb-2">
                {label} ({contacts.filter((c) => c.status === enumKey).length})
              </h2>
              <SortableContext
                items={contacts
                  .filter((c) => c.status === enumKey)
                  .map((c) => c.id.toString())}
                strategy={verticalListSortingStrategy}
              >
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

function DroppableColumn({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
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

function DraggableCard({
  contact,
  onDelete,
  onUpdate,
  token,
}: {
  contact: Contact;
  onDelete: () => void;
  onUpdate: (input: Contact) => void;
  token: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
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
        onDelete={() => {
          onDelete();
        }}
        onUpdate={onUpdate}
        token={token}
      />
    </div>
  );
}
