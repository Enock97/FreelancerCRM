"use client";
import React from "react";
import { Contact } from "../types/types";

// dnd-kit
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableCardProps {
  contact: Contact;
  statusOptions: { value: string; label: string }[];
  onEdit?: (contact: Contact, input: Partial<Contact>) => void | Promise<void>;
  onDelete?: (id: string | number) => void | Promise<void>;
  onDragEnd?: (contactId: string, newStatus: string) => void;
  refetch?: () => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  contact,
  statusOptions,
  onEdit,
  onDelete,
  onDragEnd,
  refetch,
}) => {
  // --- dnd-kit integration ---
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(contact.id),
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    cursor: "grab",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white dark:bg-gray-900 shadow rounded p-3 mb-2 cursor-move border border-gray-200 dark:border-gray-700"
    >
      <div className="font-bold dark:text-white">{contact.name}</div>
      <div className="text-gray-500 dark:text-gray-400 text-sm">{contact.company}</div>
      {/* You can add more fields if you want, e.g. phone, note, etc */}
      <div className="flex space-x-1 mt-2">
        {statusOptions
          .filter((opt) => opt.value !== contact.status)
          .map((opt) => (
            <button
              key={opt.value}
              className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-800 transition"
              onClick={() => {
                if (onDragEnd) onDragEnd(String(contact.id), opt.value);
                if (refetch) refetch();
              }}
            >
              Move to {opt.label}
            </button>
          ))}
      </div>
      <div className="flex gap-2 mt-2">
        {onEdit && (
          <button
            className="text-blue-600 dark:text-blue-400 text-xs underline"
            onClick={() => onEdit(contact, {})}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="text-red-600 dark:text-red-400 text-xs underline"
            onClick={() => onDelete(contact.id)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DraggableCard;