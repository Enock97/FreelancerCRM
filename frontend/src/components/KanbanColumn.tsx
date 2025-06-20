"use client";
import React, { useState } from "react";
import { Contact } from "../types/types";
import DraggableCard from "./DraggableCard";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ACTIVITY, DELETE_ACTIVITY } from "../app/graphql/mutations";
import { GET_CONTACTS } from "../app/graphql/queries";

import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export interface KanbanColumnProps {
  status: string;
  label: string;
  contacts: Contact[];
  onEdit: (contact: Contact, input: Partial<Contact>) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "ARCHIVED", label: "Archived" },
];

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  label,
  contacts,
  onEdit,
  onDelete,
}) => {
  // [Your activities/editing logic unchanged if you have any.]

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded p-3 w-80 min-h-[340px] border border-gray-300 dark:border-gray-700 flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
          {label}
        </span>
        <span className="bg-gray-300 dark:bg-gray-900 text-xs rounded px-2 py-0.5 text-gray-700 dark:text-gray-200">
          {contacts.length}
        </span>
      </div>
      <SortableContext items={contacts.map(c => String(c.id))} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {contacts.map((contact) => (
            <DraggableCard
              key={contact.id}
              contact={contact}
              statusOptions={statusOptions}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;