"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CONTACTS } from "../../graphql/queries"; // <-- FIX: from queries
import {
  CREATE_CONTACT,
  UPDATE_CONTACT,
  DELETE_CONTACT,
  CREATE_ACTIVITY,
  DELETE_ACTIVITY,
} from "../../graphql/mutations";
import { Contact } from "../../../types/types";
import ContactForm from "./ContactForm";

const STATUSES = ["NEW", "FOLLOW_UP", "CUSTOMER", "ARCHIVED"] as const;
type Status = (typeof STATUSES)[number];

const ContactsPage: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<{ contacts: Contact[] }>(GET_CONTACTS);
  const [createContact] = useMutation(CREATE_CONTACT);
  const [updateContact] = useMutation(UPDATE_CONTACT);
  const [deleteContact] = useMutation(DELETE_CONTACT);
  const [createActivity] = useMutation(CREATE_ACTIVITY);
  const [deleteActivity] = useMutation(DELETE_ACTIVITY);

  const [activityInput, setActivityInput] = useState<Record<number, string>>({});
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [search, setSearch] = React.useState("");
  const [openFilter, setOpenFilter] = React.useState(false);
  const [selectedStatuses, setSelectedStatuses] = React.useState<Status[]>([]);
  const [busy, setBusy] = React.useState<null | "generate" | "reset">(null);

  const allContacts = data?.contacts ?? [];

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

  // ----- SEARCH + FILTER -----
  const filteredContacts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const statusSet = new Set<Status>(selectedStatuses);
    return allContacts.filter((c) => {
      const nameOk = q === "" ? true : c.name.toLowerCase().includes(q);
      const statusOk = statusSet.size === 0 ? true : statusSet.has(c.status as Status);
      return nameOk && statusOk;
    });
  }, [allContacts, search, selectedStatuses]);

  const toggleStatus = (s: Status) => {
    setSelectedStatuses((curr) => (curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]));
  };

  // ----- GENERATE / RESET -----
  const handleGenerateContacts = async () => {
    try {
      setBusy("generate");

      const distribution: Status[] = [
        "NEW","NEW","NEW","NEW",
        "FOLLOW_UP","FOLLOW_UP",
        "CUSTOMER","CUSTOMER",
        "ARCHIVED","ARCHIVED",
      ];

      const names = [
        "Alex Johnson","Maria Perez","Liam Nguyen","Sara Ahmed",
        "Jonas Berg","Ingrid Nilsen","Priya Patel","Daniel Schmidt",
        "Elena Rossi","Mateo Silva",
      ];
      const companies = [
        "Northwind AS","Globex","Acme Co.","Innotech",
        "Polar Labs","NordicSoft","Blue Ocean","Skyline Ventures",
        "Riviera Apps","Silva Consulting",
      ];
      const phones = [
        "+47 912 34 567","+47 958 76 543","+47 482 11 220","+47 401 22 333",
        "+47 467 55 889","+47 993 44 221","+47 478 20 140","+47 902 66 710",
        "+47 415 77 930","+47 468 31 122",
      ];
      const notes = [
        "Met at Oslo meetup.","Requested pricing details.","Interested in long-term support.","Prefers email communication.",
        "Has internal approval process.","Budget review next week.","Looking for quick MVP.","Has existing CRM; wants migration.",
        "Strong lead after demo.","Referred by existing client.",
      ];

      // Snapshot size per status
      const columnSize = (status: Status) => allContacts.filter((c) => c.status === status).length;

      // Keep a local per-status bump so order stays tight per column
      const bump: Record<Status, number> = { NEW: 0, FOLLOW_UP: 0, CUSTOMER: 0, ARCHIVED: 0 };

      for (let i = 0; i < 10; i++) {
        const status = distribution[i];
        const name = names[i];
        const company = companies[i];
        const phone = phones[i];
        const note = notes[i];
        const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}.${Date.now()
          .toString()
          .slice(-6)}@example.com`;

        const order = columnSize(status) + bump[status]; // append to end of that column
        bump[status]++;

        const created = await createContact({
          variables: { input: { name, email, phone, company, status, note, order } },
        });

        const newId = Number(created?.data?.createContact?.id);
        if (!newId) continue;

        await createActivity({ variables: { contactId: newId, description: "Initial outreach" } });
        await createActivity({
          variables: {
            contactId: newId,
            description: status === "CUSTOMER" ? "Kickoff meeting" : "Follow-up scheduled",
          },
        });
      }

      await refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to generate sample contacts.");
    } finally {
      setBusy(null);
    }
  };

  const handleResetContacts = async () => {
    try {
      setBusy("reset");
      const toDelete = [...allContacts]; // snapshot
      for (const c of toDelete) {
        await deleteContact({ variables: { id: Number(c.id) } });
      }
      await refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to reset contacts.");
    } finally {
      setBusy(null);
    }
  };

  // ----- RENDER -----
  if (loading) return <div>Laster...</div>;
  if (error) return <div>Error loading contacts: {error.message}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Contacts</h1>
        <button
          onClick={handleNew}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          New contact
        </button>
      </div>

      {/* Toolbar */}
      <div className="w-full flex items-center justify-between gap-4 mb-6">
        {/* Left: Search + Filter */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts by name..."
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-w-[260px] focus:outline-none"
          />

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpenFilter((v) => !v)}
              className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              Filter {selectedStatuses.length === 0 ? "(All)" : `(${selectedStatuses.length})`}
            </button>

            {openFilter && (
              <div
                className="absolute z-20 mt-2 w-56 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-2"
                onMouseLeave={() => setOpenFilter(false)}
              >
                <div className="text-sm font-semibold px-2 py-1 text-gray-700 dark:text-gray-200">
                  Statuses
                </div>
                <div className="flex flex-col gap-1 px-2 py-1">
                  {STATUSES.map((s) => (
                    <label key={s} className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(s)}
                        onChange={() => toggleStatus(s)}
                      />
                      <span className="dark:text-gray-200">
                        {s === "NEW"
                          ? "New"
                          : s === "FOLLOW_UP"
                          ? "Follow Up"
                          : s === "CUSTOMER"
                          ? "Customer"
                          : "Archived"}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="flex items-center justify-between px-2 py-1">
                  <button className="text-xs underline dark:text-gray-200" onClick={() => setSelectedStatuses([])}>
                    Clear
                  </button>
                  <button className="text-xs underline dark:text-gray-200" onClick={() => setOpenFilter(false)}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Generate + Reset */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerateContacts}
            disabled={busy !== null}
            className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-60"
            title="Generate 10 sample contacts (2 per column; 4 in NEW) with 2 activities each"
          >
            {busy === "generate" ? "Generating..." : "Generate contacts"}
          </button>

          <button
            type="button"
            onClick={handleResetContacts}
            disabled={busy !== null}
            className="px-3 py-2 rounded bg-red-600 text-white disabled:opacity-60"
            title="Delete all contacts"
          >
            {busy === "reset" ? "Resetting..." : "Reset contacts"}
          </button>
        </div>
      </div>

      {/* New contact form (top) */}
      {showForm && !editingContact && (
        <div className="mb-4">
          <ContactForm
            onSubmit={handleSubmit}
            onCancel={() => { setShowForm(false); setEditingContact(null); }}
          />
        </div>
      )}

      {/* Contacts list */}
      <div className="mt-4 grid grid-cols-1 gap-4 dark:text-white">
        {filteredContacts.map((contact) => ( // <-- FIX: use filteredContacts
          <div
            key={contact.id}
            className="bg-gray-200 dark:bg-gray-900 p-4 rounded shadow flex flex-col gap-2"
          >
            {/* Per-contact inline edit */}
            {showForm && editingContact && editingContact.id === contact.id ? (
              <ContactForm
                onSubmit={handleSubmit}
                onCancel={() => { setShowForm(false); setEditingContact(null); }}
                initialData={editingContact}
              />
            ) : (
              <>
                <div className="dark:text-white min-w-0"> {/* min-w-0 enables wrapping in flex */}
                  <div className="font-semibold text-2xl text-yellow-400 break-words">
                    {contact.name}
                  </div>
                  {/* Email on its own line with hard wrapping */}
                  <div className="text-sm text-gray-700 dark:text-gray-300 min-w-0">
                    <span className="break-words break-all whitespace-normal overflow-hidden">
                      {contact.email}
                    </span>
                  </div>

                  <div className="text-xl text-gray-500">Status: {contact.status}</div>
                  {contact.phone && <div className="text-xl">{contact.phone}</div>}
                  {contact.company && <div className="text-xl">{contact.company}</div>}
                  {contact.note && (
                    <div className="text-xl w-full max-w-full break-words">{contact.note}</div>
                  )}
                </div>

                {/* Activities */}
                <div className="mt-2 flex flex-col gap-1">
                  <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Activities:</div>
                  <ul className="flex flex-col gap-1 dark:text-white">
                    {contact.activities && contact.activities.length > 0 ? (
                      contact.activities.map((activity) => (
                        <li
                          key={activity.id}
                          className="flex flex-col items-start bg-gray-100 dark:bg-gray-700 rounded px-2 py-1 text-sm"
                        >
                          <span className="w-full max-w-full break-words">
                            {activity.description}
                          </span>
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

                  <div className="flex mt-1 gap-1 dark:text-white">
                    <input
                      type="text"
                      className="flex-1 rounded px-2 py-1 border dark:bg-gray-900 text-sm"
                      placeholder="New activity"
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

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(contact)}
                    className="bg-yellow-600 text-white px-3 py-1 rounded"
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactsPage;
