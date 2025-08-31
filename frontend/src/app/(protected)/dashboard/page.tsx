"use client";
import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import KanbanBoard from "../../../components/KanbanBoard";
import { GET_CONTACTS } from "../../graphql/queries";
import {
  DELETE_CONTACT,
  UPDATE_CONTACT,
  REORDER_CONTACTS,
  CREATE_CONTACT,
  CREATE_ACTIVITY,
} from "../../graphql/mutations";
import type { Contact } from "../../../types/types";

const STATUSES = ["NEW", "FOLLOW_UP", "CUSTOMER", "ARCHIVED"] as const;
type Status = (typeof STATUSES)[number];

const DashboardPage: React.FC = () => {
  const { data, loading, error, refetch } = useQuery<{ contacts: Contact[] }>(GET_CONTACTS);
  const [deleteContact] = useMutation(DELETE_CONTACT);
  const [updateContact] = useMutation(UPDATE_CONTACT);
  const [reorderContactsMutation] = useMutation(REORDER_CONTACTS);
  const [createContact] = useMutation(CREATE_CONTACT);
  const [createActivity] = useMutation(CREATE_ACTIVITY);

  // --- UI state for the new features ---
  const [search, setSearch] = React.useState("");
  const [openFilter, setOpenFilter] = React.useState(false);
  const [selectedStatuses, setSelectedStatuses] = React.useState<Status[]>([]); // empty = all
  const [busy, setBusy] = React.useState<null | "generate" | "reset">(null);

  const allContacts = data?.contacts ?? [];

  // Search (by name) + Filter (by statuses). Contacts still render in their proper columns.
  const filteredContacts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const statusSet = new Set<Status>(selectedStatuses);
    return allContacts.filter((c) => {
      const nameOk = q === "" ? true : c.name.toLowerCase().includes(q);
      const statusOk = statusSet.size === 0 ? true : statusSet.has(c.status as Status);
      return nameOk && statusOk;
    });
  }, [allContacts, search, selectedStatuses]);

  const handleReorderContacts = async (input: { id: number; status: string; order: number }[]) => {
    await reorderContactsMutation({
      variables: {
        input: input.map((i) => ({
          id: Number(i.id),
          status: i.status,
          order: Number(i.order),
        })),
      },
    });
  };

  const handleDeleteContact = async (id: number) => {
    try {
      await deleteContact({ variables: { id: Number(id) } });
      await refetch();
    } catch (e) {
      console.error(e);
      alert("Could not delete contact.");
    }
  };

  const handleEditContact = async (
    contact: Contact,
    input: Partial<Contact> & { moveToLast?: boolean }
  ) => {
    try {
      const patch: Partial<Contact> & { moveToLast?: boolean } = { ...input };

      // If moving status + explicitly asked to move to end of that column
      if (patch.status && patch.moveToLast) {
        const contactsInStatus = allContacts.filter((c) => c.status === patch.status);
        patch.order = contactsInStatus.length;
      }

      const { name, email, phone, company, status, note, order } = patch;

      await updateContact({
        variables: {
          id: Number(contact.id),
          input: { name, email, phone, company, status, note, order },
        },
      });
      await refetch();
    } catch (e) {
      console.error(e);
      alert("Could not update contact.");
    }
  };

  const toggleStatus = (s: Status) => {
    setSelectedStatuses((curr) => (curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s]));
  };

  // 3) Generate 10 sample contacts, 2 activities each. Distribution: 4 NEW, 2 FOLLOW_UP, 2 CUSTOMER, 2 ARCHIVED.
  const handleGenerateContacts = async () => {
    try {
      setBusy("generate");

      const distribution: Status[] = [
        "NEW",
        "NEW",
        "NEW",
        "NEW",
        "FOLLOW_UP",
        "FOLLOW_UP",
        "CUSTOMER",
        "CUSTOMER",
        "ARCHIVED",
        "ARCHIVED",
      ];

      const names = [
        "Alex Johnson",
        "Maria Perez",
        "Liam Nguyen",
        "Sara Ahmed",
        "Jonas Berg",
        "Ingrid Nilsen",
        "Priya Patel",
        "Daniel Schmidt",
        "Elena Rossi",
        "Mateo Silva",
      ];
      const companies = [
        "Northwind AS",
        "Globex",
        "Acme Co.",
        "Innotech",
        "Polar Labs",
        "NordicSoft",
        "Blue Ocean",
        "Skyline Ventures",
        "Riviera Apps",
        "Silva Consulting",
      ];
      const phones = [
        "+47 912 34 567",
        "+47 958 76 543",
        "+47 482 11 220",
        "+47 401 22 333",
        "+47 467 55 889",
        "+47 993 44 221",
        "+47 478 20 140",
        "+47 902 66 710",
        "+47 415 77 930",
        "+47 468 31 122",
      ];
      const notes = [
        "Met at Oslo meetup.",
        "Requested pricing details.",
        "Interested in long-term support.",
        "Prefers email communication.",
        "Has internal approval process.",
        "Budget review next week.",
        "Looking for quick MVP.",
        "Has existing CRM; wants migration.",
        "Strong lead after demo.",
        "Referred by existing client.",
      ];

      for (let i = 0; i < 10; i++) {
        const status = distribution[i];
        const name = names[i];
        const company = companies[i];
        const phone = phones[i];
        const note = notes[i];
        const email = `${name.toLowerCase().replace(/[^a-z]+/g, ".")}.${Date.now()
          .toString()
          .slice(-6)}@example.com`;

        // order = end of column at creation time
        const order = allContacts.filter((c) => (c.status as Status) === status).length;

        const created = await createContact({
          variables: {
            input: { name, email, phone, company, status, note, order },
          },
        });

        const newId = Number(created?.data?.createContact?.id);
        if (!newId) continue;

        // Two simple activities per contact
        const act1 = "Initial outreach";
        const act2 = status === "CUSTOMER" ? "Kickoff meeting" : "Follow-up scheduled";

        await createActivity({ variables: { contactId: newId, description: act1 } });
        await createActivity({ variables: { contactId: newId, description: act2 } });
      }

      await refetch();
    } catch (e) {
      console.error(e);
      alert("Failed to generate sample contacts.");
    } finally {
      setBusy(null);
    }
  };

  // 4) Reset contacts (delete ALL). Backend already cascades activities on contact delete.
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

  if (loading) {
    return (
      <div className="w-full max-w-[2000px] mx-auto px-1 py-6 text-gray-700 dark:text-gray-200">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[2000px] mx-auto px-1 py-6 text-red-600">
        Error loading contacts.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[2000px] mx-auto px-1 py-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Dashboard</h1>

      {/* Top bar above the Kanban board */}
      <div className="w-full flex items-center justify-between gap-4 mb-6">
        {/* Left: Search + Filter */}
        <div className="flex items-center gap-3">
          {/* 1) Dynamic search bar (by name) */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contacts by name..."
            className="px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-w-[260px] focus:outline-none"
          />

          {/* 2) Filter button (statuses) */}
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
                    <label
                      key={s}
                      className="inline-flex items-center gap-2 text-sm text-gray-800 dark:text-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStatuses.includes(s)}
                        onChange={() => toggleStatus(s)}
                      />
                      <span>
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
                  <button
                    className="text-xs underline text-gray-600 dark:text-gray-300"
                    onClick={() => setSelectedStatuses([])}
                  >
                    Clear
                  </button>
                  <button
                    className="text-xs underline text-gray-600 dark:text-gray-300"
                    onClick={() => setOpenFilter(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Generate + Reset */}
        <div className="flex items-center gap-3">
          {/* 3) Generate contacts */}
          <button
            type="button"
            onClick={handleGenerateContacts}
            disabled={busy !== null}
            className="px-3 py-2 rounded bg-green-600 text-white disabled:opacity-60"
            title="Generate 10 sample contacts (2 per column; 4 in NEW) with 2 activities each"
          >
            {busy === "generate" ? "Generating..." : "Generate contacts"}
          </button>

          {/* 4) Reset contacts */}
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

      <KanbanBoard
        contacts={filteredContacts}
        onEdit={handleEditContact}
        onDelete={handleDeleteContact}
        reorderContacts={handleReorderContacts}
        refetch={refetch}
      />
    </div>
  );
};

export default DashboardPage;
