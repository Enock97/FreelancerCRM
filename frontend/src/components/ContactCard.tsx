'use client'

import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import {
  UPDATE_CONTACT,
  DELETE_CONTACT,
  CREATE_ACTIVITY,
} from '@/app/graphql/mutations'
import { GET_CONTACTS, GET_ACTIVITIES } from '@/app/graphql/queries'
import ContactForm from '@/app/(protected)/contacts/ContactForm'
import { Contact, Activity } from '@/types/types'
import { ContactInputType } from '@/types/contactInput'

type ContactPatch = Partial<ContactInputType> & { id: number }

interface Props {
  contact: Contact
  token: string
  onUpdate?: (c: Contact) => void
  onDelete?: (id: number) => void
}

export default function ContactCard({
  contact,
  token,
  onUpdate,
  onDelete,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [addingAct, setAddingAct] = useState(false)
  const [actTitle, setActTitle] = useState('')
  const [actNote, setActNote] = useState('')

  /* ===== GraphQL ===== */
  const { data: actData, refetch: refetchActs } = useQuery(GET_ACTIVITIES, {
    variables: { contactId: contact.id },
    context: { headers: { Authorization: `Bearer ${token}` } },
  })

  const [updateContact] = useMutation(UPDATE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [{ query: GET_CONTACTS }],
  })

  const [deleteContact] = useMutation(DELETE_CONTACT, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    refetchQueries: [{ query: GET_CONTACTS }],
  })

  const [createActivity] = useMutation(CREATE_ACTIVITY, {
    context: { headers: { Authorization: `Bearer ${token}` } },
    onCompleted: () => refetchActs(),
  })

  /* ===== Handlers ===== */
  const handleSave = (changes: ContactInputType): void => {
    const patch: ContactPatch = { id: contact.id, ...changes }

    updateContact({ variables: { data: patch } })
      .then(() => {
        onUpdate?.({ ...contact, ...patch })
        setEditing(false)
      })
      .catch(console.error)
  }

  const handleDelete = () =>
    deleteContact({ variables: { id: contact.id } }).then(() =>
      onDelete?.(contact.id)
    )

  const handleAddActivity = () => {
    if (!actTitle.trim()) return
    createActivity({
      variables: {
        data: {
          title: actTitle.trim(),
          note: actNote.trim() || null,
          contactId: contact.id,
        },
      },
    })
      .then(() => {
        setActTitle('')
        setActNote('')
        setAddingAct(false)
      })
      .catch(console.error)
  }

  /* ===== UI ===== */
if (editing) {
  const inputForForm: ContactInputType = {
    ...contact,
    phone: contact.phone ?? '',
    company: contact.company ?? '',
    note: contact.note ?? '',
  }

  return (
    <ContactForm
      initialData={inputForForm}
      onSubmit={handleSave}
      onCancel={() => setEditing(false)}
    />
  )
}

  const activities: Activity[] = actData?.activities ?? []

  return (
    <div className="space-y-2 bg-white dark:bg-gray-800 text-black dark:text-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold">{contact.name}</h3>
      <p>
        <b>E-post:</b> {contact.email}
      </p>
      <p>
        <b>Telefon:</b> {contact.phone ?? '—'}
      </p>
      <p>
        <b>Firma:</b> {contact.company ?? '—'}
      </p>
      <p>
        <b>Status:</b> {contact.status.replace(/_/g, ' ')}
      </p>
      <p>
        <b>Notat:</b> {contact.note ?? '—'}
      </p>

      {activities.length > 0 && (
        <div className="border-t pt-2 space-y-1 text-sm">
          <p className="font-semibold">Aktiviteter</p>
          {activities.map((a) => (
            <div key={a.id}>
              • <b>{a.title}</b>
              {a.note ? ` – ${a.note}` : ''}
            </div>
          ))}
        </div>
      )}

      {addingAct ? (
        <div className="border-t pt-2 space-y-1">
          <input
            className="w-full border p-1 rounded"
            placeholder="Tittel"
            value={actTitle}
            onChange={(e) => setActTitle(e.target.value)}
          />
          <textarea
            className="w-full border p-1 rounded"
            placeholder="Notat"
            value={actNote}
            onChange={(e) => setActNote(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddActivity}
              className="px-2 py-1 bg-green-600 text-white rounded"
            >
              Lagre
            </button>
            <button
              onClick={() => setAddingAct(false)}
              className="px-2 py-1 bg-gray-500 text-white rounded"
            >
              Avbryt
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingAct(true)}
          className="px-2 py-1 bg-indigo-600 text-white rounded"
        >
          Legg til aktivitet
        </button>
      )}

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => setEditing(true)}
          className="px-3 py-1 bg-yellow-500 text-white rounded"
        >
          Rediger
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1 bg-red-600 text-white rounded"
        >
          Slett
        </button>
      </div>
    </div>
  )
}
