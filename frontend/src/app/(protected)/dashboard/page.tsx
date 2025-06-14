"use client";
import React, { useCallback } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTACTS } from "../../graphql/queries";
import { UPDATE_CONTACT } from "../../graphql/mutations";
import DraggableCard from "../../../components/DraggableCard";
import { Contact } from "../../../types/types";

const statusOptions = [
  { value: "NY", label: "Ny" },
  { value: "OPPFØLGING", label: "Oppfølging" },
  { value: "KUNDE", label: "Kunde" },
  { value: "ARKIVERT", label: "Arkivert" },
];

const DashboardPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_CONTACTS);
  const [updateContact] = useMutation(UPDATE_CONTACT, {
    onCompleted: () => refetch(),
  });

  const onDragEnd = useCallback(
    async (contactId: string, newStatus: string) => {
      await updateContact({
        variables: { id: contactId, input: { status: newStatus } },
      });
    },
    [updateContact]
  );

  if (loading) return <div>Laster...</div>;
  if (error) return <div>Feil ved lasting av dashboard</div>;

  // Del opp kontakter i kolonner etter status
  const contacts = data.contacts || [];
  const columns = statusOptions.map(({ value, label }) => ({
    status: value,
    label,
    contacts: contacts.filter((c: Contact) => c.status === value),
  }));

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {columns.map((col) => (
        <div key={col.status} className="flex-1 bg-gray-100 dark:bg-gray-800 rounded p-2 min-h-[300px]">
          <div className="font-bold mb-2 dark:text-white">
            {col.label} ({col.contacts.length})
          </div>
          <div>
            {col.contacts.map((contact: Contact) => (
              <DraggableCard
                key={contact.id}
                contact={contact}
                statusOptions={statusOptions}
                onDragEnd={onDragEnd}
                refetch={refetch}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;
