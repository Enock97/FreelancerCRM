"use client";
import React from "react";
import KanbanColumn from "./KanbanColumn";
import { Contact } from "../types/types";

import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
//import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

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
      acc[status] = contacts
        .filter((c: Contact) => c.status === status)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {} as Record<string, Contact[]>)
  );

  React.useEffect(() => {
    setColumns(
      statuses.reduce((acc, status) => {
        acc[status] = contacts
          .filter((c: Contact) => c.status === status)
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        return acc;
      }, {} as Record<string, Contact[]>)
    );
  }, [contacts]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Find the card being moved
    let sourceStatus: string | undefined;
    let sourceIdx: number | undefined;
    let targetStatus: string | undefined;
    let targetIdx: number | undefined;

    for (const status of statuses) {
      const idx = columns[status].findIndex((c) => String(c.id) === String(active.id));
      if (idx > -1) {
        sourceStatus = status;
        sourceIdx = idx;
      }
      const overIdx = columns[status].findIndex((c) => String(c.id) === String(over.id));
      if (overIdx > -1) {
        targetStatus = status;
        targetIdx = overIdx;
      }
    }

    // If dropped on empty column (not over another card)
    if (!targetStatus) {
      // Try to extract status from over.id (column drop area)
      if (statuses.includes(String(over.id))) {
        targetStatus = String(over.id);
        targetIdx = columns[targetStatus].length;
      }
    }

    if (
      typeof sourceStatus === "undefined" ||
      typeof sourceIdx === "undefined" ||
      typeof targetStatus === "undefined" ||
      typeof targetIdx === "undefined"
    ) {
      return;
    }

    const newColumns = { ...columns };
    const movedCard = newColumns[sourceStatus][sourceIdx];

    // Remove from source
    newColumns[sourceStatus] = newColumns[sourceStatus].filter(
      (c) => String(c.id) !== String(active.id)
    );

    // Insert into target at correct index
    newColumns[targetStatus].splice(targetIdx, 0, movedCard);

    // Update orders and status for all cards in both columns
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
    /*
    try {
      await onEdit(movedCard, { status: targetStatus, order: targetIdx });
    } catch (err) {
      // Error handling: up to you (no dialog spam)
      // Optionally set a global error state here if you want to display somewhere
    } */
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-row w-full gap-6 overflow-x-auto min-h-[80vh]">
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            label={statusLabels[status]}
            contacts={columns[status]}
            onEdit={onEdit}
            onDelete={onDelete}
            /** 👇👇👇 Add this prop */
            columnId={status}
          />
        ))}
      </div>
    </DndContext>

  );
};

export default KanbanBoard;
