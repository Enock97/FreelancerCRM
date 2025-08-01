"use client";
import { Contact } from "../types/types";
import React from "react";
import DraggableCard from "./DraggableCard";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useMutation } from "@apollo/client";
import { CREATE_ACTIVITY, DELETE_ACTIVITY } from "../app/graphql/mutations";
import { useDroppable } from "@dnd-kit/core";

export interface KanbanColumnProps {
  status: string;
  label: string;
  contacts: Contact[];
  onEdit: (contact: Contact, input: Partial<Contact>) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
  refetch: () => void;
}

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "ARCHIVED", label: "Archived" },
];

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  label,
  contacts,
  onEdit,
  onDelete,
  status,
  refetch,
}) => {
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [deleteActivity] = useMutation(DELETE_ACTIVITY);

  const handleAddActivity = async (contactId: number, description: string) => {
    if (!description.trim()) return;
    await createActivity({ variables: { contactId, description } });
    await refetch();
  };

  const handleDeleteActivity = async (activityId: number) => {
    await deleteActivity({ variables: { id: activityId } });
    await refetch();
  };

  const { setNodeRef } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className="bg-gray-100 min-w-[260px] dark:bg-gray-800 rounded p-3 w-80 min-h-[340px] border border-gray-300 dark:border-gray-700 flex flex-col"
    >
      <div className="flex items-center justify-between mb-2 text-center">
        <span className="font-bold text-3xl text-yellow-600">
          {label}
        </span>
        <span className="bg-gray-300 dark:bg-gray-900 text-xs rounded px-2 py-0.5 text-gray-700 dark:text-gray-200">
          {contacts.length}
        </span>
      </div>
      <SortableContext items={contacts.map(c => String(c.id))} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {contacts.map((contact) => (
            <MemoDraggableCard
              key={`${contact.id}-${(contact.activities?.length ?? 0)}`}
              contact={contact}
              statusOptions={statusOptions}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddActivity={handleAddActivity}
              onDeleteActivity={handleDeleteActivity}
              refetch={refetch}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const MemoDraggableCard = React.memo(DraggableCard);

export default React.memo(KanbanColumn);
