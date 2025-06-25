"use client";
import React from "react";
import KanbanColumn from "./KanbanColumn";
import { Contact } from "../types/types";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, pointerWithin } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import DraggableCard from "./DraggableCard";

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
  reorderContacts: (input: { id: number; status: string; order: number }[]) => Promise<void>;
}

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "ARCHIVED", label: "Archived" },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  contacts,
  onEdit,
  onDelete,
  reorderContacts,
}) => {
  const [columns, setColumns] = React.useState<Record<string, Contact[]>>(() =>
    statuses.reduce((acc, status) => {
      acc[status] = contacts
        .filter((c) => c.status === status)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {} as Record<string, Contact[]>)
  );

  const [activeCard, setActiveCard] = React.useState<Contact | null>(null);
  const [, setIsDragging] = React.useState(false);

  // Helper to compare the "shape" of columns vs contacts
function columnsEqual(columns: Record<string, Contact[]>, contacts: Contact[]): boolean {
  // Flatten all columns into one list, sort by id, compare id+order+status
  const localFlat = Object.values(columns).flat().sort((a, b) => a.id - b.id);
  const contactFlat = [...contacts].sort((a, b) => a.id - b.id);
  if (localFlat.length !== contactFlat.length) return false;
  return localFlat.every((c, i) =>
    c.id === contactFlat[i].id &&
    c.status === contactFlat[i].status &&
    c.order === contactFlat[i].order
  );
}


  React.useEffect(() => {
    // Only re-sync if server data disagrees with local (after mutation, etc)
    if (!columnsEqual(columns, contacts)) {
      setColumns(
        statuses.reduce((acc, status) => {
          acc[status] = contacts
            .filter((c) => c.status === status)
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          return acc;
        }, {} as Record<string, Contact[]>)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contacts]);

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;
    for (const status of statuses) {
      const card = columns[status].find((c) => String(c.id) === String(active.id));
      if (card) {
        setActiveCard(card);
        break;
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveCard(null);
    setIsDragging(false);

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let sourceStatus: string | undefined;
    let sourceIdx: number | undefined;
    for (const status of statuses) {
      const idx = columns[status].findIndex((c) => String(c.id) === String(active.id));
      if (idx > -1) {
        sourceStatus = status;
        sourceIdx = idx;
        break;
      }
    }

    let targetStatus: string | undefined;
    let targetIdx: number | undefined;
    for (const status of statuses) {
      const idx = columns[status].findIndex((c) => String(c.id) === String(over.id));
      if (idx > -1) {
        targetStatus = status;
        targetIdx = idx;
        break;
      }
    }
    if (!targetStatus && statuses.includes(String(over.id))) {
      targetStatus = String(over.id);
      targetIdx = columns[targetStatus].length;
    }

    if (
      typeof sourceStatus === "undefined" ||
      typeof sourceIdx === "undefined" ||
      typeof targetStatus === "undefined" ||
      typeof targetIdx === "undefined"
    ) {
      return;
    }

    // Defensive copy
    const newColumns = { ...columns };

    // Always remove the moved card from its source array
    const sourceArr = [...newColumns[sourceStatus]];
    const [movedCard] = sourceArr.splice(sourceIdx, 1);

    // Remove from target column as well, in case it's mistakenly present
    const targetArr = [...newColumns[targetStatus]].filter((c) => String(c.id) !== String(active.id));

    // Insert in new target position
    targetArr.splice(targetIdx, 0, { ...movedCard, status: targetStatus });

    // Rebuild column objects (order is always 0...N)
    const updatedSource = sourceArr.map((c, idx) => ({
      id: Number(c.id),
      status: sourceStatus,
      order: idx,
    }));
    const updatedTarget = targetArr.map((c, idx) => ({
      id: Number(c.id),
      status: targetStatus,
      order: idx,
    }));

    // Optimistically update UI with NO duplicates
    setColumns({
      ...newColumns,
      [sourceStatus]: sourceArr,
      [targetStatus]: targetArr,
    });

    // Fire mutation but do NOT await (keeps UI snappy)
    reorderContacts([...updatedSource, ...updatedTarget]).catch(() => {
      // Optionally: show error, refetch, or rollback here
    });
  };



  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
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
      <DragOverlay>
        {activeCard && (
          <DraggableCard
            contact={activeCard}
            statusOptions={statusOptions}
            onEdit={() => {}}
            onDelete={() => {}}
            onAddActivity={async () => {}}
            onDeleteActivity={async () => {}}
            refetch={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
