"use client";
import React from "react";
import { useQuery } from "@apollo/client";
import { GET_CONTACTS } from "../app/graphql/queries";
import KanbanColumn from "./KanbanColumn";
import { Contact } from "../types/types";

const statusOptions = [
  { key: "NY", label: "Ny" },
  { key: "OPPFOLGING", label: "Oppfølging" },
  { key: "KUNDE", label: "Kunde" },
  { key: "ARKIVERT", label: "Arkivert" },
];

const KanbanBoard = () => {
  const { data, loading, error } = useQuery(GET_CONTACTS);

  if (loading) return <div className="text-center text-gray-500 dark:text-gray-300">Laster Kanban...</div>;
  if (error) return <div className="text-center text-red-500">Kunne ikke hente data</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {statusOptions.map((status) => (
        <KanbanColumn
          key={status.key}
          status={status.key}
          title={status.label}
          contacts={data.contacts.filter((c: Contact) => c.status === status.key)}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
