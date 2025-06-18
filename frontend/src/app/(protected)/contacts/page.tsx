"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTACTS, CREATE_CONTACT, UPDATE_CONTACT, DELETE_CONTACT, CREATE_ACTIVITY, DELETE_ACTIVITY
} from "../../graphql/mutations";
import { Contact } from "../../../types/types";
import ContactForm from "./ContactForm";

const ContactsPage: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<{ contacts: Contact[] }>(GET_CONTACTS);
  const [createContact] = useMutation(CREATE_CONTACT);
  const [updateContact] = useMutation(UPDATE_CONTACT);
  const [deleteContact] = useMutation(DELETE_CONTACT);
  const [activityInput, setActivityInput] = useState<Record<number, string>>({});
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [deleteActivity] = useMutation(DELETE_ACTIVITY);

  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (loading) return <div>Laster...</div>;
  if (error) return <div>Error loading contacts: {error.message}</div>;

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    await deleteContact({ variables: { id } });
    await refetch();
  };

  const handleNew = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleSubmit = async (formData: Omit<Contact, "id" | "createdAt" | "activities">) => {
    if (editingContact) {
      await updateContact({ variables: { id: editingContact.id, input: formData } });
    } else {
      await createContact({ variables: { input: formData } });
    }
    setShowForm(false);
    setEditingContact(null);
    await refetch();
  };

  return (
    <div className="max-w-4xl mx-auto ">
      <div className="flex justify-between items-center mb-4 ">
        <h1 className="text-2xl font-bold dark:text-white">Contacts</h1>
        <button onClick={handleNew} className="bg-blue-600 text-white px-4 py-2 rounded">
          New contact
        </button>
      </div>
      {showForm && (
        <ContactForm
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditingContact(null); }}
          initialData={editingContact || undefined}
        />
      )}
      <div className="mt-4 grid grid-cols-1 gap-4  dark:text-white">
        {data?.contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-gray-200 dark:bg-gray-900 p-4 rounded shadow flex flex-col gap-2"
          >
            <div className="dark:text-white">
              <span className="font-semibold text-2xl text-blue-400">{contact.name}</span> &ndash; {contact.email}
              <div className="text-xl text-gray-500">Status: {contact.status}</div>
              {contact.phone && <div className="text-xl">{contact.phone}</div>}
              {contact.company && <div className="text-xl">{contact.company}</div>}
              {contact.note && <div className="text-xl w-full max-w-full break-words">{contact.note}</div>}
            </div>
            {/* --- ACTIVITIES --- */}
            <div className="mt-2 flex flex-col gap-1">
              <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Activities:</div>
              <ul className="flex flex-col gap-1 dark:text-white">
                {contact.activities && contact.activities.length > 0 ? (
                  contact.activities.map((activity) => (
                    <li key={activity.id} className="flex flex-col items-start bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-sm">
                      <span className="w-full max-w-full break-words">{activity.description}</span>
                      <button
                        className="ml-2 px-2 py-0.5 bg-red-500 text-white self-end rounded text-xs"
                        onClick={async () => {
                          await deleteActivity({ variables: { id: activity.id } });
                          await refetch();
                        }}
                        type="button"
                      >
                        Delete
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-400">No activities</li>
                )}
              </ul>
              {/* Add new activity input */}
              <div className="flex mt-1 gap-1 dark:text-white">
                <input
                  type="text"
                  className="flex-1 rounded px-2 py-1 border dark:bg-gray-900 text-sm"
                  placeholder="New activitity"
                  value={activityInput[contact.id] || ""}
                  onChange={e =>
                    setActivityInput((prev) => ({
                      ...prev,
                      [contact.id]: e.target.value,
                    }))
                  }
                  onKeyDown={async e => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const description = activityInput[contact.id]?.trim();
                      if (!description) return;
                      await createActivity({ variables: { contactId: contact.id, description } });
                      setActivityInput((prev) => ({ ...prev, [contact.id]: "" }));
                      await refetch();
                    }
                  }}
                />
                <button
                  type="button"
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                  onClick={async () => {
                    const description = activityInput[contact.id]?.trim();
                    if (!description) return;
                    await createActivity({ variables: { contactId: contact.id, description } });
                    setActivityInput((prev) => ({ ...prev, [contact.id]: "" }));
                    await refetch();
                  }}
                >
                  Add
                </button>
              </div>
            </div>
            {/* --- END ACTIVITIES --- */}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(contact)}
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(contact.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPage;
