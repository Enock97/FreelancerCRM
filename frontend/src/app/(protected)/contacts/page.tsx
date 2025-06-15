"use client";
import React from "react";
import ContactList from "@/components/ContactList";
import { useQuery } from "@apollo/client";
import { GET_CONTACTS } from "../../graphql/queries";

const ContactsPage = () => {
  const { data, loading, error } = useQuery(GET_CONTACTS);

  console.log("Contacts Page:", JSON.stringify(data, null, 2));

  if (loading) {
    return <div>Laster...</div>;
  }

  if (error) {
    return <div className="text-red-500">Feil ved lasting av kontakter</div>;
  }

  // Her: data.contacts skal sendes inn som props
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">Kontakter</h1>
      <ContactList contacts={data?.contacts ?? []} />
    </div>
  );
};

export default ContactsPage;
