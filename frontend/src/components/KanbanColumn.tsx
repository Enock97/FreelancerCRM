"use client";
import React, { useState } from "react";
import { Contact } from "../types/types";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ACTIVITY, DELETE_ACTIVITY } from "../app/graphql/mutations";
import { GET_CONTACTS } from "../app/graphql/queries";

export interface KanbanColumnProps {
  status: string;
  label: string;
  contacts: Contact[];
  onEdit: (contact: Contact, input: Partial<Contact>) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
}

const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "ARCHIVED", label: "Archived" },
];

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  label,
  contacts,
  onEdit,
  onDelete,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFields, setEditFields] = useState<Partial<Contact>>({});
  const [activityInput, setActivityInput] = useState<Record<number, string>>({});
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [deleteActivity] = useMutation(DELETE_ACTIVITY);
  const { refetch } = useQuery(GET_CONTACTS);

  const startEdit = (contact: Contact) => {
    setEditingId(contact.id);
    setEditFields({ ...contact });
  };

  const handleEditField = (field: keyof Contact, value: string) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async (contact: Contact) => {
    await onEdit(contact, editFields);
    setEditingId(null);
    setEditFields({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditFields({});
  };

  const handleAddActivity = async (contactId: number) => {
    const description = activityInput[contactId]?.trim();
    if (!description) return;
    await createActivity({ variables: { contactId, description } });
    setActivityInput((prev) => ({ ...prev, [contactId]: "" }));
    await refetch();
  };

  const handleDeleteActivity = async (activityId: number) => {
    await deleteActivity({ variables: { id: activityId } });
    await refetch();
  };

  return (
    <div className="flex-1 min-w-[260px] bg-gray-200 dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg shadow p-4 flex flex-col">
      <h3 className="font-bold mb-4 text-3xl text-blue-600 text-center">{label}</h3>
      <div className="flex-1 flex flex-col gap-4">
        {contacts.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-600">No contacts</div>
        )}
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2"
          >
            {editingId === contact.id ? (
              <form
                className="flex flex-col gap-2"
                onSubmit={e => {
                  e.preventDefault();
                  handleSave(contact);
                }}
              >
                <input
                  type="text"
                  className="rounded px-2 py-1 border dark:bg-gray-900"
                  value={editFields.name ?? ""}
                  onChange={e => handleEditField("name", e.target.value)}
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  className="rounded px-2 py-1 border dark:bg-gray-900"
                  value={editFields.email ?? ""}
                  onChange={e => handleEditField("email", e.target.value)}
                  placeholder="Email"
                  required
                />
                <input
                  type="tel"
                  className="rounded px-2 py-1 border dark:bg-gray-900"
                  value={editFields.phone ?? ""}
                  onChange={e => handleEditField("phone", e.target.value)}
                  placeholder="Phone"
                />
                <input
                  type="text"
                  className="rounded px-2 py-1 border dark:bg-gray-900"
                  value={editFields.company ?? ""}
                  onChange={e => handleEditField("company", e.target.value)}
                  placeholder="Company"
                />
                {/* Status - dropdown, alltid vertikal */}
                <select
                  className="rounded px-2 py-1 border dark:bg-gray-900"
                  value={editFields.status ?? status}
                  onChange={e => handleEditField("status", e.target.value)}
                  required
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <textarea
                  className="rounded px-2 py-1 border dark:bg-gray-900"
                  value={editFields.note ?? ""}
                  onChange={e => handleEditField("note", e.target.value)}
                  placeholder="Note"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    type="submit"
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <main className="this-needs-to-be-draggable dark:text-gray-300 space-y-1.5">
                <div className="text-2xl font-bold text-blue-400">{contact.name}</div>
                <div className="text-base"><span className="font-semibold">Email: </span>{contact.email}</div>
                <div className="text-base"><span className="font-semibold">Phone: </span>{contact.phone}</div>
                <div className="text-base "><span className="font-semibold">Company: </span>{contact.company}</div>
                <div className="text-base  dark:text-gray-500">
                  <span className=" font-semibold">Status: </span> {contact.status}
                </div>
                <div className="text-sm w-full max-w-full break-words"><span className="font-semibold">Note: </span>{contact.note}</div>
                {/* --- ACTIVITY LIST --- */}
                <div className="mt-2 flex flex-col gap-1">
                  <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Activities:</div>
                  <ul className=" flex flex-col gap-1 ">
                    {contact.activities && contact.activities.length > 0 ? (
                      contact.activities.map((activity) => (
                        <li key={activity.id} className="flex flex-col items-start bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-sm">
                          <span className="w-full max-w-full break-words">{activity.description}</span>
                          <button
                            className="ml-2 px-2 py-0.5 bg-red-500 text-white self-end rounded text-xs"
                            onClick={() => handleDeleteActivity(activity.id)}
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
                  <div className="flex flex-row items-center gap-2 mt-2 w-full">
                    <input
                      type="text"
                      className="flex-1 min-w-0 rounded px-2 py-1 border dark:bg-gray-900 text-sm"
                      placeholder="New activitity"
                      value={activityInput[contact.id] || ""}
                      onChange={e =>
                        setActivityInput((prev) => ({
                          ...prev,
                          [contact.id]: e.target.value,
                        }))
                      }
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddActivity(contact.id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                      onClick={() => handleAddActivity(contact.id)}
                    >
                      Add
                    </button>
                  </div>
                </div>
                {/* --- END ACTIVITIES --- */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEdit(contact)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(contact.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </main>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;
