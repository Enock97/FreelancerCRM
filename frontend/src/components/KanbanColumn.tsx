// src/components/KanbanColumn.tsx

import React from "react";
import ContactCard from "./ContactCard";
import { Contact } from "../types/types";

interface KanbanColumnProps {
  status: string;
  title: string;
  contacts: Contact[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, title, contacts }) => (
  <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow flex flex-col gap-4 min-h-[180px]">
    <div className="font-semibold mb-2 text-gray-700 dark:text-white flex justify-between items-center">
      <span>{title}</span>
      <span className="bg-gray-300 dark:bg-gray-700 px-2 py-0.5 rounded text-xs">{contacts.length}</span>
    </div>
    <div className="mb-2 text-sm text-gray-500 dark:text-gray-400">Status: <span className="font-mono">{status}</span></div>
    {contacts.length === 0 ? (
      <div className="text-gray-400 dark:text-gray-500 text-sm">Ingen kontakter</div>
    ) : (
      <div className="flex flex-col gap-2">
        {contacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </div>
    )}
  </div>
);

export default KanbanColumn;
