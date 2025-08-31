// src/components/ContactCard.tsx
"use client";
import React from "react";
import { Contact } from "../types/types";

interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (id: number) => void;
  onUpdate?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="font-semibold">{contact.name}</div>
      <div className="text-xs text-gray-500 ">{contact.email}</div>
      <div className="text-xs text-gray-500">{contact.phone}</div>
      <div className="text-xs text-gray-500">{contact.company}</div>
      <div className="text-xs text-gray-500">
        Status: <span className="font-bold">{contact.status}</span>
      </div>
      <div className="text-xs text-gray-500">{contact.note}</div>
      <div className="flex gap-2 mt-2">
        {onEdit && (
          <button
            onClick={() => onEdit(contact)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(contact.id)}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
