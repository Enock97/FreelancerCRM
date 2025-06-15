"use client";
import React from "react";
import KanbanColumn from "./KanbanColumn";
import { Contact } from "../types/types";

const statuses = ["NY", "OPPFOLGING", "KUNDE", "ARKIVERT"];

const statusLabels: Record<string, string> = {
  NY: "Ny",
  OPPFOLGING: "Oppfølging",
  KUNDE: "Kunde",
  ARKIVERT: "Arkivert",
};

export interface KanbanBoardProps {
  contacts: Contact[];
  onEdit: (contact: Contact, input: Partial<Contact>) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ contacts, onEdit, onDelete }) => {
  return (
    <div className="flex flex-row w-full gap-6 overflow-x-none min-h-[80vh]">
      {statuses.map((status) => (
        <KanbanColumn
          key={status}
          status={status}
          label={statusLabels[status]}
          contacts={contacts.filter((c: Contact) => c.status === status)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
