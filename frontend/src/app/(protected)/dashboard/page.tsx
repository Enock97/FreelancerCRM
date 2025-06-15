"use client";
import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import KanbanBoard from "../../../components/KanbanBoard";
import { GET_CONTACTS, DELETE_CONTACT, UPDATE_CONTACT } from "../../graphql/mutations";
import { Contact } from "../../../types/types";

const DashboardPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_CONTACTS);
  const [deleteContact] = useMutation(DELETE_CONTACT);
  const [updateContact] = useMutation(UPDATE_CONTACT);

  // For å trigge refresh etter sletting/oppdatering
  const handleDeleteContact = async (id: number) => {
    try {
      await deleteContact({ variables: { id: Number(id) } });
      refetch();
    } catch (e) {
      console.log(e)
      alert("Kunne ikke slette kontakt.");
    }
  };

  const handleEditContact = async (contact: Contact, input: Partial<Contact>) => {
    try {
      // Fjern felter som ikke skal være med i input
      const { name, email, phone, company, status, note } = input;
      await updateContact({
        variables: { id: Number(contact.id), input: { name, email, phone, company, status, note } },
      });
      refetch();
    } catch (e) {
      console.log(e)
      alert("Kunne ikke oppdatere kontakt.");
    }
  };

  if (loading) return <div className="text-center mt-10">Laster kontakter…</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Feil ved henting av kontakter</div>;

  return (
    <div className="w-full max-w-[2000px] mx-auto px-1 py-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Dashboard</h1>
      <KanbanBoard
        contacts={data?.contacts || []}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
      />
    </div>
  );
};

export default DashboardPage;
