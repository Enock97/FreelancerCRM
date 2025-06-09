import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import ContactCard from './ContactCard';
import { Contact } from '../types/types';

interface Props {
  contact: Contact;
  onDelete: (id: number) => void;
  onUpdate: (updated: Contact) => void;
  token: string;
}

export default function DraggableCard({ contact, onDelete, onUpdate, token }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: contact.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ scale: 1 }}
      animate={{ scale: isDragging ? 1.03 : 1 }}
    >
      <ContactCard
        contact={contact}
        onDelete={onDelete}
        onUpdate={onUpdate}
        token={token}
      />
    </motion.div>
  );
}