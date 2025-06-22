"use client";
import React, { useState } from "react";
import { Contact } from "../types/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// --- Status options (should be imported/shared if used elsewhere) ---
export const statusOptions = [
  { value: "NEW", label: "New" },
  { value: "FOLLOW_UP", label: "Follow Up" },
  { value: "CUSTOMER", label: "Customer" },
  { value: "ARCHIVED", label: "Archived" },
];

interface DraggableCardProps {
  contact: Contact;
  onEdit: (contact: Contact, input: Partial<Contact> & { moveToLast?: boolean }) => void | Promise<void>;
  onDelete: (id: number) => void | Promise<void>;
  onAddActivity: (contactId: number, description: string) => Promise<void>;
  onDeleteActivity: (activityId: number) => Promise<void>;
  refetch: () => void;
  statusOptions: { value: string; label: string }[];
}

const DraggableCard: React.FC<DraggableCardProps> = ({
  contact,
  onEdit,
  onDelete,
  onAddActivity,
  onDeleteActivity,
  refetch,
  statusOptions,
}) => {
  // dnd-kit integration
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(contact.id) });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  // Local state for editing and activities
  const [editing, setEditing] = useState(false);
  const [editFields, setEditFields] = useState<Partial<Contact>>({});
  const [activityInput, setActivityInput] = useState<string>("");

  // Start edit
  const startEdit = () => {
    setEditing(true);
    setEditFields({ ...contact });
  };

  // Handle field changes
  const handleEditField = (field: keyof Contact, value: string) => {
    setEditFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Save edit
  const handleSave = async () => {
    const patch: Partial<Contact> & { moveToLast?: boolean } = { ...editFields };
    if (
      editFields.status &&
      editFields.status !== contact.status
    ) {
      // Instead of order: "moveToLast", use a flag
      patch.moveToLast = true;
    }
    await onEdit(contact, patch);
    setEditing(false);
    setEditFields({});
  };

  // Cancel edit
  const handleCancel = () => {
    setEditing(false);
    setEditFields({});
  };

  // Add activity
  const handleAddActivity = async () => {
    const description = activityInput.trim();
    if (!description) return;
    await onAddActivity(contact.id, description);
    setActivityInput("");
    refetch();
  };

  // Delete activity
  const handleDeleteActivity = async (activityId: number) => {
    await onDeleteActivity(activityId);
    refetch();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col gap-2 mb-2 border border-gray-200 dark:border-gray-700 relative"
    >
      {/* Drag handle */}
      <span
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 cursor-grab text-gray-400 hover:text-yellow-400 z-10"
        title="Drag"
        style={{ userSelect: "none" }}
        tabIndex={-1}
      >
        <GripVertical size={18} />
      </span>

      {editing ? (
        <form
          className="flex flex-col gap-2 dark:text-white"
          onSubmit={e => {
            e.preventDefault();
            handleSave();
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
          {/* Status dropdown */}
          <select
            className="rounded px-2 py-1 border dark:bg-gray-900"
            value={editFields.status ?? contact.status}
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
        <main className="dark:text-gray-300 space-y-1.5">
          <div className="text-2xl font-bold text-yellow-400">{contact.name}</div>
          <div className="text-base"><span className="font-semibold">Email: </span>{contact.email}</div>
          <div className="text-base"><span className="font-semibold">Phone: </span>{contact.phone}</div>
          <div className="text-base"><span className="font-semibold">Company: </span>{contact.company}</div>
          <div className="text-base dark:text-gray-500">
            <span className="font-semibold">Status: </span> {contact.status}
          </div>
          <div className="text-sm w-full max-w-full break-words"><span className="font-semibold">Note: </span>{contact.note}</div>
          {/* Activities */}
          <div className="mt-2 flex flex-col gap-1">
            <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Activities:</div>
            <ul className="flex flex-col gap-1">
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
                placeholder="New activity"
                value={activityInput}
                onChange={e => setActivityInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddActivity();
                  }
                }}
              />
              <button
                type="button"
                className="px-2 py-1 bg-green-600 text-white rounded text-xs"
                onClick={handleAddActivity}
              >
                Add
              </button>
            </div>
          </div>
          {/* --- END ACTIVITIES --- */}
          <div className="flex gap-2 mt-2">
            <button
              onClick={startEdit}
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
  );
};

export default DraggableCard;
