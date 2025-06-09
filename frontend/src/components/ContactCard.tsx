import { useState, useEffect } from 'react';
import { Contact } from '../types/types';

interface Activity {
  id: number;
  title: string;
  note: string;
  createdAt: string;
}

interface Props {
  contact: Contact;
  onDelete: (id: number) => void;
  onUpdate: (updated: Contact) => void;
  token: string;
}

// Oppdater enumverdier etter din backend
const STATUS_OPTIONS = [
  'VENTER_PA_SVAR',
  'I_SAMTALE',
  'TENKER_PA_DET',
  'AVKLART',
];

export default function ContactCard({ contact, onDelete, onUpdate, token }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Contact>({
    ...contact,
    status: contact.status || '',
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState({ title: '', note: '' });

  const fetchActivities = async () => {
    const res = await fetch(`http://localhost:5000/api/activities/${contact.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setActivities(data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    const res = await fetch(`http://localhost:5000/api/contacts/${contact.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    onUpdate(data);
    setEditing(false);
  };

  const handleDelete = async () => {
    await fetch(`http://localhost:5000/api/contacts/${contact.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    onDelete(contact.id);
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewActivity(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddActivity = async () => {
    const res = await fetch(`http://localhost:5000/api/activities/${contact.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...newActivity, contactId: contact.id }),
    });
    const created = await res.json();
    setActivities(prev => [created, ...prev]);
    setNewActivity({ title: '', note: '' });
  };

  return (
    <div className="border p-4 rounded shadow-sm space-y-2">
      {editing ? (
        <>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border p-1" />
          <input name="email" value={form.email} onChange={handleChange} className="w-full border p-1" />
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full border p-1" />
          <input name="company" value={form.company} onChange={handleChange} className="w-full border p-1" />
          <select
            name="status"
            value={form.status || ''}
            onChange={handleChange}
            className="w-full border p-1"
            required
          >
            <option value="" disabled>Velg status</option>
            {STATUS_OPTIONS.map(status => (
              <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <textarea name="note" value={form.note} onChange={handleChange} className="w-full border p-1" />
          <button onClick={handleUpdate} className="bg-green-500 text-white px-2 py-1 rounded mr-2">Lagre</button>
          <button onClick={() => setEditing(false)} className="bg-gray-400 text-white px-2 py-1 rounded">Avbryt</button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-semibold">{contact.name}</h2>
          <p>{contact.email} – {contact.phone}</p>
          <p>Firma: {contact.company}</p>
          <p>Status: {contact.status ? contact.status.replace(/_/g, ' ') : 'Ingen status'}</p>
          <p className="text-sm text-gray-600">{contact.note}</p>
          <div className="space-x-2 mt-2">
            <button onClick={() => setEditing(true)} className="bg-yellow-500 text-white px-2 py-1 rounded">Rediger</button>
            <button onClick={handleDelete} className="bg-red-600 text-white px-2 py-1 rounded">Slett</button>
          </div>
        </>
      )}

      <div className="mt-4 space-y-2">
        <h3 className="font-semibold">Ny aktivitet</h3>
        <input
          name="title"
          value={newActivity.title}
          onChange={handleActivityChange}
          placeholder="Tittel"
          className="w-full border p-1"
        />
        <textarea
          name="note"
          value={newActivity.note}
          onChange={handleActivityChange}
          placeholder="Notat"
          className="w-full border p-1"
        />
        <button onClick={handleAddActivity} className="bg-blue-600 text-white px-2 py-1 rounded">Lagre aktivitet</button>

        <div className="mt-2">
          {activities.map(act => (
            <div key={act.id} className="border-t pt-2 mt-2">
              <p className="font-semibold">{act.title}</p>
              <p className="text-sm">{act.note}</p>
              <p className="text-xs text-gray-500">{new Date(act.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
