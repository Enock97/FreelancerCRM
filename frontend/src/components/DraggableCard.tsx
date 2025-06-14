"use client";
import React, { useRef } from "react";
import { Contact } from "../types/types";

interface DraggableCardProps {
  contact: Contact;
  statusOptions: { value: string; label: string }[];
  onDragEnd: (contactId: string, newStatus: string) => void;
  refetch: () => void;
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  contact,
  statusOptions,
  onDragEnd,
  refetch,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // For enkel drag/drop uten ekstern dnd-pakke (HTML5)
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("id", contact.id);
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    if (id && id === contact.id && contact.status !== newStatus) {
      onDragEnd(contact.id, newStatus);
      refetch();
    }
  };

  return (
    <div
      ref={cardRef}
      className="bg-white dark:bg-gray-900 shadow rounded p-3 mb-2 cursor-move"
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="font-bold dark:text-white">{contact.name}</div>
      <div className="text-gray-500 dark:text-gray-400 text-sm">{contact.company}</div>
      <div className="flex space-x-1 mt-2">
        {statusOptions
          .filter((opt) => opt.value !== contact.status)
          .map((opt) => (
            <button
              key={opt.value}
              className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white mr-1"
              onClick={() => onDragEnd(contact.id, opt.value)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(e, opt.value)}
            >
              Flytt til {opt.label}
            </button>
          ))}
      </div>
    </div>
  );
};

export default DraggableCard;
