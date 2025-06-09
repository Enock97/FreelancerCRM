'use client';

import { useDrop } from 'react-dnd';
import ContactCard from './ContactCard';
import { Contact } from '../types/types';
import { useRef } from 'react';


interface Props {
  status: string;
  contacts: Contact[];
  onStatusChange: (id: number, newStatus: string) => void;
  onDelete: (id: number) => void;
  onUpdate: (updated: Contact) => void;
  token: string;
}

export default function KanbanColumn({ status, contacts, onStatusChange, onDelete, onUpdate, token }: Props) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'contact',
    drop: (item: Contact) => onStatusChange(item.id, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));


  const dropRef = useRef<HTMLDivElement | null>(null);
  drop(dropRef);

  return (
    <div ref={dropRef} className={`p-4 rounded border min-h-[200px] ${isOver ? 'bg-blue-100' : 'bg-gray-100'}`}>
      <h2 className="text-lg font-semibold mb-2">{status}</h2>
      {contacts.map((c) => (
        <ContactCard key={c.id} contact={c} onDelete={onDelete} onUpdate={onUpdate} token={token} />
      ))}
    </div>
  );
}
