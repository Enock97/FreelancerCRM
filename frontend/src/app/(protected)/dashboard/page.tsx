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

  const handleDeleteContact = async (id: number) => {
    try {
      await deleteContact({ variables: { id: Number(id) } });
      refetch();
    } catch (e) {
      console.log(e)
      alert("Could not delete contact.");
    }
  };

  const handleEditContact = async (contact: Contact, input: Partial<Contact> & { moveToLast?: boolean }) => {
  try {
    const patch = { ...input };

    // If moving to another status and "moveToLast" is set, set order to max+1 in that status
    if (patch.status && patch.moveToLast) {
      // Find current contacts in the new status column
      const allContacts: Contact[] = data?.contacts || [];
      const contactsInStatus = allContacts.filter(c => c.status === patch.status);
      patch.order = contactsInStatus.length; // Move to end
    }

    const { name, email, phone, company, status, note, order } = patch;

    await updateContact({
      variables: {
        id: Number(contact.id),
        input: { name, email, phone, company, status, note, order },
      },
    });
    refetch();
  } catch (e) {
    console.log(e)
    alert("Could not update contact.");
  }
  };


  if (loading) return <div className="text-center mt-10">Loading contacts…</div>;
  if (error) return <div className="text-red-500 text-center mt-10">Error loading contacts</div>;

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
