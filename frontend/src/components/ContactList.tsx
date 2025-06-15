// src/components/ContactList.tsx

import React from "react";
import ContactCard from "./ContactCard";
import { Contact } from "../types/types";

interface ContactListProps {
  contacts: Contact[];
}

const ContactList: React.FC<ContactListProps> = ({ contacts }) => {
  if (!contacts || contacts.length === 0) {
    return (
      <div className="text-gray-400 dark:text-gray-500 text-sm">
        Ingen kontakter funnet.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
};

export default ContactList;
