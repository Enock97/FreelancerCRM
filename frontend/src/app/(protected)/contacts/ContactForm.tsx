"use client";
import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_CONTACT, UPDATE_CONTACT } from "../../graphql/mutations";
import { GET_CONTACTS } from "../../graphql/queries";
import { Contact } from "../../../types/types";

interface ContactFormProps {
  initialData?: Contact;
  onCancel: () => void;
  onSubmit: () => void;
}

const statusOptions = [
  "NY", "OPPFØLGING", "KUNDE", "ARKIVERT"
];

const ContactForm: React.FC<ContactFormProps> = ({
  initialData,
  onCancel,
  onSubmit,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [phone, setPhone] = useState(initialData?.phone || "");
  const [company, setCompany] = useState(initialData?.company || "");
  const [status, setStatus] = useState(initialData?.status || "NY");
  const [note, setNote] = useState(initialData?.note || "");

  const [createContact] = useMutation(CREATE_CONTACT, {
    refetchQueries: [{ query: GET_CONTACTS }],
  });
  const [updateContact] = useMutation(UPDATE_CONTACT, {
    refetchQueries: [{ query: GET_CONTACTS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      await updateContact({
        variables: {
          id: initialData.id,
          input: { name, email, phone, company, status, note },
        },
      });
    } else {
      await createContact({
        variables: { input: { name, email, phone, company, status, note } },
      });
    }
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        className="w-full rounded px-2 py-1 border dark:bg-gray-900 dark:text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Navn"
        required
      />
      <input
        className="w-full rounded px-2 py-1 border dark:bg-gray-900 dark:text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-post"
        type="email"
        required
      />
      <input
        className="w-full rounded px-2 py-1 border dark:bg-gray-900 dark:text-white"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Telefon"
      />
      <input
        className="w-full rounded px-2 py-1 border dark:bg-gray-900 dark:text-white"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Firma"
      />
      <select
        className="w-full rounded px-2 py-1 border dark:bg-gray-900 dark:text-white"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {statusOptions.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <textarea
        className="w-full rounded px-2 py-1 border dark:bg-gray-900 dark:text-white"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Notat"
        rows={2}
      />
      <div className="flex space-x-2">
        <button type="submit" className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Lagre</button>
        <button type="button" className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={onCancel}>Avbryt</button>
      </div>
    </form>
  );
};

export default ContactForm;
