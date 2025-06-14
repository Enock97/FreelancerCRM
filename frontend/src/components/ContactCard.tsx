"use client";
import React, { useState } from "react";
import { Contact, Activity } from "../types/types";
import { useMutation } from "@apollo/client";
import { DELETE_CONTACT, CREATE_ACTIVITY, DELETE_ACTIVITY } from "../app/graphql/mutations";
import { GET_CONTACTS } from "../app/graphql/queries";
import ContactForm from "../app/(protected)/contacts/ContactForm";

interface ContactCardProps {
  contact: Contact;
  onUpdate?: () => void;
}

const ContactCard: React.FC<ContactCardProps> = ({ contact, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [activityText, setActivityText] = useState("");
  const [createActivity] = useMutation(CREATE_ACTIVITY, {
    refetchQueries: [{ query: GET_CONTACTS }],
  });
  const [deleteActivity] = useMutation(DELETE_ACTIVITY, {
    refetchQueries: [{ query: GET_CONTACTS }],
  });
  const [deleteContact] = useMutation(DELETE_CONTACT, {
    refetchQueries: [{ query: GET_CONTACTS }],
  });

  const handleEdit = () => setEditMode(true);

  const handleActivityAdd = async () => {
    if (!activityText.trim()) return;
    await createActivity({
      variables: {
        contactId: contact.id,
        description: activityText.trim(),
      },
    });
    setActivityText("");
  };

  const handleActivityDelete = async (activityId: string) => {
    await deleteActivity({ variables: { id: activityId } });
  };

  const handleDelete = async () => {
    await deleteContact({ variables: { id: contact.id } });
    onUpdate?.();
  };

  if (editMode) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-4">
        <ContactForm
          initialData={contact}
          onCancel={() => setEditMode(false)}
          onSubmit={() => {
            setEditMode(false);
            onUpdate?.();
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mb-4">
      <div className="flex justify-between">
        <div>
          <div className="font-bold dark:text-white">{contact.name}</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">{contact.email}</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">{contact.phone}</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">{contact.company}</div>
          <div className="text-gray-500 dark:text-gray-400 text-sm">{contact.status}</div>
        </div>
        <div className="flex flex-col space-y-2">
          <button onClick={handleEdit} className="text-blue-600 dark:text-blue-400 hover:underline">Rediger</button>
          <button onClick={handleDelete} className="text-red-600 dark:text-red-400 hover:underline">Slett</button>
        </div>
      </div>
      <div className="mt-4">
        <div className="font-semibold dark:text-white mb-2">Aktiviteter:</div>
        {contact.activities?.map((activity: Activity) => (
          <div key={activity.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mb-1">
            <span className="text-gray-800 dark:text-gray-200">{activity.description}</span>
            <button onClick={() => handleActivityDelete(activity.id)} className="text-red-500 hover:underline ml-2">Slett</button>
          </div>
        ))}
        <div className="flex mt-2">
          <input
            type="text"
            className="flex-1 rounded-l px-2 py-1 border dark:bg-gray-900 dark:text-white"
            value={activityText}
            onChange={(e) => setActivityText(e.target.value)}
            placeholder="Ny aktivitet..."
          />
          <button
            onClick={handleActivityAdd}
            className="rounded-r px-4 py-1 bg-blue-500 text-white hover:bg-blue-600"
          >
            Legg til
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
