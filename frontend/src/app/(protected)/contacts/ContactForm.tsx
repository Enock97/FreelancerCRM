'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_CONTACT } from '../../graphql/mutations';
import { GET_CONTACTS } from '../../graphql/queries';
import { Contact } from '../../../types/types';

interface Props {
  onSubmit: (data: Omit<Contact, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Partial<Contact>;
}

const STATUS_OPTIONS = [
  'VENTER_PA_SVAR',
  'I_SAMTALE',
  'TENKER_PA_DET',
  'AVKLART',
];

export default function ContactForm({ onCancel }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: '',
    note: '',
  });

  const [createContact] = useMutation(CREATE_CONTACT, {
    refetchQueries: [{ query: GET_CONTACTS }],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createContact({ variables: { data: form } });
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-2xl shadow-md"
    >
      <h2 className="text-xl font-semibold mb-2">Ny kontakt</h2>
      <input name="name" placeholder="Navn" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" required />
      <input name="email" placeholder="E-post" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" required />
      <input name="phone" placeholder="Telefonnummer" value={form.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" />
      <input name="company" placeholder="Firma" value={form.company} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" />
      <select name="status" value={form.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" required>
        <option value="" disabled>Velg status</option>
        {STATUS_OPTIONS.map((status) => (
          <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
        ))}
      </select>
      <textarea name="note" placeholder="Notat" value={form.note} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2" />
      <div className="flex gap-2">
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700">Lagre</button>
        <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-xl hover:bg-gray-600">Avbryt</button>
      </div>
    </form>
  );
}
