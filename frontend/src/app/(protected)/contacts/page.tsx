"use client";
import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CONTACTS } from "../../graphql/queries";
import ContactCard from "../../../components/ContactCard";
import ContactForm from "./ContactForm";
import { Contact } from "../../../types/types";

const ContactsPage = () => {
  const { data, loading, error, refetch } = useQuery(GET_CONTACTS);
  const [addMode, setAddMode] = useState(false);

  if (loading) return <div>Laster...</div>;
  if (error) return <div>Feil ved lasting av kontakter</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold dark:text-white">Kontakter</h2>
        <button
          onClick={() => setAddMode(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Ny kontakt
        </button>
      </div>
      {addMode && (
        <div className="mb-4">
          <ContactForm
            onCancel={() => setAddMode(false)}
            onSubmit={() => {
              setAddMode(false);
              refetch();
            }}
          />
        </div>
      )}
      <div>
        {data.contacts.map((contact: Contact) => (
          <ContactCard key={contact.id} contact={contact} onUpdate={refetch} />
        ))}
      </div>
    </div>
  );
};

export default ContactsPage;
