"use client";
import React from "react";
import KanbanColumn from "./KanbanColumn";
import { Contact } from "../types/types";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

const statuses = ["NEW", "FOLLOW_UP", "CUSTOMER", "ARCHIVED"];

const statusLabels: Record<string, string> = {
  NEW: "New",
  FOLLOW_UP: "Follow Up",
  CUSTOMER: "Customer",
  ARCHIVED: "Archived",
};

export interface KanbanBoardProps {
  contacts: Contact[];
  onEdit: (contact: Contact, input: Partial<Contact>) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  contacts,
  onEdit,
  onDelete,
}) => {
  const [columns, setColumns] = React.useState<Record<string, Contact[]>>(() =>
    statuses.reduce((acc, status) => {
      acc[status] = contacts.filter((c: Contact) => c.status === status)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {} as Record<string, Contact[]>)
  );

  React.useEffect(() => {
    setColumns(
      statuses.reduce((acc, status) => {
        acc[status] = contacts.filter((c: Contact) => c.status === status)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return acc;
      }, {} as Record<string, Contact[]>)
    );
  }, [contacts]);

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let sourceStatus, targetStatus, sourceIdx, targetIdx;
    for (const status of statuses) {
      const idx = columns[status].findIndex((c) => String(c.id) === String(active.id));
      if (idx > -1) {
        sourceStatus = status;
        sourceIdx = idx;
      }
      const target = columns[status].find((c) => String(c.id) === String(over.id));
      if (target) {
        targetStatus = status;
        targetIdx = columns[status].indexOf(target);
      }
    }
    if (typeof sourceStatus === "undefined" || typeof targetStatus === "undefined") return;

    let newColumns = { ...columns };
    let movedCard = newColumns[sourceStatus][sourceIdx];

    newColumns[sourceStatus] = newColumns[sourceStatus].filter((c) => String(c.id) !== String(active.id));
    newColumns[targetStatus].splice(targetIdx, 0, movedCard);

    newColumns[targetStatus] = newColumns[targetStatus].map((card, idx) => ({
      ...card,
      status: targetStatus,
      order: idx,
    }));
    if (sourceStatus !== targetStatus) {
      newColumns[sourceStatus] = newColumns[sourceStatus].map((card, idx) => ({
        ...card,
        order: idx,
      }));
    }

    setColumns(newColumns);

    await onEdit(movedCard, { status: targetStatus, order: targetIdx });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-row w-full gap-6 overflow-x-auto min-h-[80vh]">
        <SortableContext items={statuses} strategy={verticalListSortingStrategy}>
          {statuses.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              label={statusLabels[status]}
              contacts={columns[status]}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};

export default KanbanBoard;