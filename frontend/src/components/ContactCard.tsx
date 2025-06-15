"use client";
import React from "react";
import { Contact } from "../types/types";

const ContactCard = ({ contact }: { contact: Contact }) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-5 flex flex-col gap-2 border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <div className="font-semibold text-lg dark:text-white">{contact.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
          {contact.phone && <div className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</div>}
          {contact.company && <div className="text-sm text-gray-500 dark:text-gray-400">{contact.company}</div>}
        </div>
        <div className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 dark:text-gray-200 text-gray-600">
          {contact.status}
        </div>
      </div>
      {contact.note && (
        <div className="mt-2 text-gray-700 dark:text-gray-300 text-sm">Note: {contact.note}</div>
      )}
      <div className="flex gap-2 text-xs text-gray-400 mt-2">
        <span>Opprettet: {new Date(contact.createdAt).toLocaleDateString("no-NO")}</span>
        <span>| {contact.activities?.length || 0} aktiviteter</span>
      </div>
    </div>
  );
};

export default ContactCard;
